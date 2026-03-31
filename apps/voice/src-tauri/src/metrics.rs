use crate::db::{HistoryItem, PermissionEvent};
use chrono::{Datelike, Duration, Local, NaiveDate, NaiveDateTime, TimeZone, Timelike};
use serde::Serialize;
use std::collections::{BTreeMap, BTreeSet, HashMap};
use vader_sentiment::SentimentIntensityAnalyzer;

#[derive(Serialize, Clone)]
pub struct AnalyticsOverview {
    pub total_words: usize,
    pub total_raw_words: usize,
    pub time_saved_min: usize,
    pub total_sessions: usize,
    pub avg_wpm: usize,
    pub current_streak: usize,
    pub longest_streak: usize,
    pub avg_time_saved_per_session_min: f64,
    pub projected_monthly_saved_min: usize,
    pub projected_yearly_saved_min: usize,
    pub filler_filtered_words: usize,
    pub total_speaking_min: usize,
    pub total_silence_min: usize,
    pub total_permission_alerts: usize,
    pub sentiment: SentimentResult,
    pub top_words: Vec<WordFreq>,
    pub word_cloud: Vec<WordFreq>,
    pub hourly_heatmap: Vec<HourlyActivity>,
    pub yearly_heatmap: Vec<YearlyActivity>,
    pub recent_productivity: Vec<DailyProductivity>,
    pub sentiment_trend: Vec<SentimentTrendPoint>,
    pub permission_alerts: Vec<PermissionAlertSummary>,
    pub streak: StreakSummary,
}

#[derive(Serialize, Clone)]
pub struct SentimentResult {
    pub positive: f64,
    pub neutral: f64,
    pub negative: f64,
    pub average_compound: f64,
    pub average_confidence: f64,
    pub dominant_label: String,
}

#[derive(Serialize, Clone)]
pub struct HourlyActivity {
    pub hour: String,
    pub words: usize,
    pub sessions: usize,
    pub intensity: f64,
}

#[derive(Serialize, Clone)]
pub struct YearlyActivity {
    pub date: String,
    pub label: String,
    pub month: String,
    pub week_index: usize,
    pub weekday: usize,
    pub words: usize,
    pub sessions: usize,
    pub intensity: f64,
}

#[derive(Serialize, Clone)]
pub struct WordFreq {
    pub word: String,
    pub count: usize,
    pub percentage: f64,
}

#[derive(Serialize, Clone)]
pub struct DailyProductivity {
    pub date: String,
    pub label: String,
    pub words: usize,
    pub saved_min: usize,
    pub sessions: usize,
}

#[derive(Serialize, Clone)]
pub struct SentimentTrendPoint {
    pub date: String,
    pub positive: f64,
    pub neutral: f64,
    pub negative: f64,
    pub compound: f64,
}

#[derive(Serialize, Clone)]
pub struct PermissionAlertSummary {
    pub permission_key: String,
    pub count: usize,
    pub last_event_type: String,
    pub last_message: String,
    pub last_seen: String,
}

#[derive(Serialize, Clone)]
pub struct StreakSummary {
    pub current: usize,
    pub longest: usize,
    pub last_active_date: Option<String>,
    pub next_milestone: usize,
    pub reward_label: String,
}

#[derive(Clone)]
pub struct AudioCaptureSummary {
    pub duration_ms: u64,
    pub speaking_ms: u64,
    pub silence_ms: u64,
    pub effective_duration_ms: u64,
}

#[derive(Clone)]
pub struct SessionAnalytics {
    pub raw_word_count: usize,
    pub clean_word_count: usize,
    pub avg_wpm: f64,
    pub time_saved_ms: u64,
    pub sentiment_label: String,
    pub sentiment_compound: f64,
    pub sentiment_confidence: f64,
}

#[derive(Clone)]
struct SessionSentimentBreakdown {
    positive: f64,
    neutral: f64,
    negative: f64,
    compound: f64,
    confidence: f64,
    label: String,
}

#[derive(Clone)]
struct HydratedSession {
    text: String,
    raw_word_count: usize,
    clean_word_count: usize,
    speaking_ms: u64,
    silence_ms: u64,
    effective_duration_ms: u64,
    time_saved_ms: u64,
    sentiment: SessionSentimentBreakdown,
    timestamp: Option<chrono::DateTime<Local>>,
}

#[derive(Default, Clone)]
struct DailyAggregate {
    words: usize,
    saved_min: usize,
    sessions: usize,
    positive: f64,
    neutral: f64,
    negative: f64,
    compound: f64,
}

const STOP_WORDS: &[&str] = &[
    "the", "is", "in", "at", "of", "on", "and", "a", "to", "it", "that", "this", "for", "with", "as", "was", "are", "be", "by", "or", "an", "from", "if", "but", "not", "de", "la", "que", "el", "y", "en", "los", "del", "se", "las", "por", "un", "para", "con", "una", "su", "al", "lo", "como", "más", "mas", "o", "ya", "le", "les", "me", "mi", "tu", "te", "nos", "yo", "usted", "ustedes", "we", "you", "they", "he", "she", "them", "our", "your", "their",
];

const FILLER_WORDS: &[&str] = &[
    "um", "uh", "erm", "hmm", "mm", "mmm", "ah", "eh", "like", "okay", "ok", "este", "ehm", "pues", "aja", "ajá", "mmmhm", "huh", "ehhh",
];

const NOISE_TOKENS: &[&str] = &[
    "blankaudio", "silence", "music", "noise", "unknown", "inaudible",
];

pub fn summarize_audio_buffer(buffer: &[f32]) -> AudioCaptureSummary {
    let duration_ms = ((buffer.len() as f64 / 16000.0) * 1000.0).round() as u64;
    if buffer.is_empty() {
        return AudioCaptureSummary {
            duration_ms: 0,
            speaking_ms: 0,
            silence_ms: 0,
            effective_duration_ms: 0,
        };
    }

    let frame_size = 1600usize;
    let frame_ms = 100u64;
    let mut speaking_ms = 0u64;
    let mut silence_ms = 0u64;

    for frame in buffer.chunks(frame_size) {
        let sum = frame.iter().map(|sample| sample.abs()).sum::<f32>();
        let avg = if frame.is_empty() { 0.0 } else { sum / frame.len() as f32 };
        if avg >= 0.015 {
            speaking_ms += frame_ms;
        } else {
            silence_ms += frame_ms;
        }
    }

    if speaking_ms + silence_ms > duration_ms {
        let overflow = speaking_ms + silence_ms - duration_ms;
        silence_ms = silence_ms.saturating_sub(overflow);
    }

    let effective_duration_ms = if speaking_ms == 0 {
        duration_ms
    } else {
        speaking_ms + adjust_pause_ms(silence_ms)
    };

    AudioCaptureSummary {
        duration_ms,
        speaking_ms,
        silence_ms,
        effective_duration_ms,
    }
}

pub fn analyze_session(text: &str, effective_duration_ms: u64) -> SessionAnalytics {
    let raw_word_count = raw_word_count(text);
    let clean_word_count = cleaned_tokens(text).len();
    let effective_minutes = effective_duration_ms as f64 / 60000.0;
    let avg_wpm = if effective_minutes > 0.0 {
        clean_word_count as f64 / effective_minutes
    } else {
        0.0
    };
    let typing_time_ms = ((clean_word_count as f64 / 40.0) * 60000.0).round() as u64;
    let time_saved_ms = typing_time_ms.saturating_sub(effective_duration_ms);
    let sentiment = analyze_sentiment(text);

    SessionAnalytics {
        raw_word_count,
        clean_word_count,
        avg_wpm,
        time_saved_ms,
        sentiment_label: sentiment.label,
        sentiment_compound: sentiment.compound,
        sentiment_confidence: sentiment.confidence,
    }
}

pub fn process_analytics(history: &[HistoryItem], permission_events: &[PermissionEvent]) -> AnalyticsOverview {
    let sessions = hydrate_sessions(history);
    if sessions.is_empty() {
        let streak = StreakSummary {
            current: 0,
            longest: 0,
            last_active_date: None,
            next_milestone: 3,
            reward_label: "Start your first streak".to_string(),
        };
        return AnalyticsOverview {
            total_words: 0,
            total_raw_words: 0,
            time_saved_min: 0,
            total_sessions: 0,
            avg_wpm: 0,
            current_streak: 0,
            longest_streak: 0,
            avg_time_saved_per_session_min: 0.0,
            projected_monthly_saved_min: 0,
            projected_yearly_saved_min: 0,
            filler_filtered_words: 0,
            total_speaking_min: 0,
            total_silence_min: 0,
            total_permission_alerts: permission_events.len(),
            sentiment: SentimentResult {
                positive: 0.0,
                neutral: 100.0,
                negative: 0.0,
                average_compound: 0.0,
                average_confidence: 0.0,
                dominant_label: "neutral".to_string(),
            },
            top_words: Vec::new(),
            word_cloud: Vec::new(),
            hourly_heatmap: empty_hourly_heatmap(),
            yearly_heatmap: empty_yearly_heatmap(),
            recent_productivity: empty_recent_productivity(),
            sentiment_trend: empty_sentiment_trend(),
            permission_alerts: summarize_permission_alerts(permission_events),
            streak: streak.clone(),
        };
    }

    let total_sessions = sessions.len();
    let total_words = sessions.iter().map(|entry| entry.clean_word_count).sum::<usize>();
    let total_raw_words = sessions.iter().map(|entry| entry.raw_word_count).sum::<usize>();
    let total_effective_duration_ms = sessions.iter().map(|entry| entry.effective_duration_ms).sum::<u64>();
    let total_time_saved_ms = sessions.iter().map(|entry| entry.time_saved_ms).sum::<u64>();
    let total_speaking_min = (sessions.iter().map(|entry| entry.speaking_ms).sum::<u64>() as f64 / 60000.0).round() as usize;
    let total_silence_min = (sessions.iter().map(|entry| entry.silence_ms).sum::<u64>() as f64 / 60000.0).round() as usize;
    let avg_wpm = if total_effective_duration_ms > 0 {
        (total_words as f64 / (total_effective_duration_ms as f64 / 60000.0)).round() as usize
    } else {
        0
    };
    let time_saved_min = (total_time_saved_ms as f64 / 60000.0).round() as usize;
    let avg_time_saved_per_session_min = if total_sessions > 0 {
        ((total_time_saved_ms as f64 / 60000.0) / total_sessions as f64 * 10.0).round() / 10.0
    } else {
        0.0
    };

    let active_days = sessions
        .iter()
        .filter_map(|entry| entry.timestamp.as_ref().map(|timestamp| timestamp.date_naive()))
        .collect::<BTreeSet<_>>();
    let active_day_count = active_days.len().max(1) as f64;
    let projected_monthly_saved_min = ((time_saved_min as f64 / active_day_count) * 30.0).round() as usize;
    let projected_yearly_saved_min = ((time_saved_min as f64 / active_day_count) * 365.0).round() as usize;
    let streak = build_streak_summary(&active_days);
    let sentiment = build_sentiment_summary(&sessions);
    let top_words = build_word_frequencies(&sessions, 12);
    let word_cloud = build_word_frequencies(&sessions, 30);
    let hourly_heatmap = build_hourly_heatmap(&sessions);
    let yearly_heatmap = build_yearly_heatmap(&sessions);
    let (recent_productivity, sentiment_trend) = build_daily_trends(&sessions);

    AnalyticsOverview {
        total_words,
        total_raw_words,
        time_saved_min,
        total_sessions,
        avg_wpm,
        current_streak: streak.current,
        longest_streak: streak.longest,
        avg_time_saved_per_session_min,
        projected_monthly_saved_min,
        projected_yearly_saved_min,
        filler_filtered_words: total_raw_words.saturating_sub(total_words),
        total_speaking_min,
        total_silence_min,
        total_permission_alerts: permission_events.len(),
        sentiment,
        top_words,
        word_cloud,
        hourly_heatmap,
        yearly_heatmap,
        recent_productivity,
        sentiment_trend,
        permission_alerts: summarize_permission_alerts(permission_events),
        streak,
    }
}

pub fn export_history_csv(history: &[HistoryItem]) -> String {
    let mut rows = vec!["id,timestamp,text,duration_ms,speaking_ms,silence_ms,effective_duration_ms,raw_word_count,clean_word_count,avg_wpm,time_saved_ms,sentiment_label,sentiment_compound,sentiment_confidence".to_string()];
    for item in history {
        rows.push(format!(
            "{},{},{},{},{},{},{},{},{},{:.2},{},{},{:.4},{:.4}",
            item.id,
            csv_escape(&item.timestamp),
            csv_escape(&item.text),
            item.duration_ms,
            item.speaking_ms,
            item.silence_ms,
            item.effective_duration_ms,
            item.raw_word_count,
            item.clean_word_count,
            item.avg_wpm,
            item.time_saved_ms,
            csv_escape(&item.sentiment_label),
            item.sentiment_compound,
            item.sentiment_confidence,
        ));
    }
    rows.join("\n")
}

pub fn export_analytics_csv(overview: &AnalyticsOverview, history: &[HistoryItem], permission_events: &[PermissionEvent]) -> String {
    let mut rows = vec![
        "metric,value".to_string(),
        format!("total_sessions,{}", overview.total_sessions),
        format!("total_words,{}", overview.total_words),
        format!("total_raw_words,{}", overview.total_raw_words),
        format!("avg_wpm,{}", overview.avg_wpm),
        format!("time_saved_min,{}", overview.time_saved_min),
        format!("current_streak,{}", overview.current_streak),
        format!("longest_streak,{}", overview.longest_streak),
        format!("filler_filtered_words,{}", overview.filler_filtered_words),
        format!("projected_monthly_saved_min,{}", overview.projected_monthly_saved_min),
        format!("projected_yearly_saved_min,{}", overview.projected_yearly_saved_min),
        format!("total_permission_alerts,{}", overview.total_permission_alerts),
        String::new(),
        "top_word,count,percentage".to_string(),
    ];

    for word in &overview.top_words {
        rows.push(format!("{},{},{:.2}", csv_escape(&word.word), word.count, word.percentage));
    }

    rows.push(String::new());
    rows.push("permission_key,event_type,message,source,timestamp".to_string());
    for event in permission_events {
        rows.push(format!(
            "{},{},{},{},{}",
            csv_escape(&event.permission_key),
            csv_escape(&event.event_type),
            csv_escape(&event.message),
            csv_escape(&event.source),
            csv_escape(&event.timestamp),
        ));
    }

    rows.push(String::new());
    rows.push(export_history_csv(history));
    rows.join("\n")
}

pub fn export_analytics_pdf(overview: &AnalyticsOverview, history: &[HistoryItem], permission_events: &[PermissionEvent]) -> Vec<u8> {
    let mut lines = vec![
        "SloerVoice Analytics Report".to_string(),
        format!("Generated: {}", Local::now().format("%Y-%m-%d %H:%M:%S")),
        String::new(),
        format!("Sessions: {}", overview.total_sessions),
        format!("Clean words: {}", overview.total_words),
        format!("Raw words: {}", overview.total_raw_words),
        format!("Average WPM: {}", overview.avg_wpm),
        format!("Time saved: {} min", overview.time_saved_min),
        format!("Current streak: {} days", overview.current_streak),
        format!("Longest streak: {} days", overview.longest_streak),
        format!("Dominant sentiment: {}", overview.sentiment.dominant_label),
        format!("Permission alerts: {}", overview.total_permission_alerts),
        String::new(),
        "Top words".to_string(),
    ];

    for word in overview.top_words.iter().take(8) {
        lines.push(format!("- {}: {} ({:.1}%)", word.word, word.count, word.percentage));
    }

    lines.push(String::new());
    lines.push("Recent sessions".to_string());
    for item in history.iter().take(8) {
        lines.push(format!(
            "- {} | {} words | {:.1} wpm | {}",
            item.timestamp,
            item.clean_word_count,
            item.avg_wpm,
            trim_text(&item.text, 84)
        ));
    }

    if !permission_events.is_empty() {
        lines.push(String::new());
        lines.push("Permission alerts".to_string());
        for event in permission_events.iter().take(8) {
            lines.push(format!("- {} | {} | {}", event.timestamp, event.permission_key, trim_text(&event.message, 72)));
        }
    }

    build_simple_pdf(&lines)
}

pub fn adjust_pause_ms(ms: u64) -> u64 {
    let natural_window = ms.min(1800);
    let long_pause = ms.saturating_sub(1800);
    natural_window + ((long_pause as f64) * 0.35).round() as u64
}

fn raw_word_count(text: &str) -> usize {
    text.split_whitespace().filter(|token| !token.trim().is_empty()).count()
}

fn cleaned_tokens(text: &str) -> Vec<String> {
    text.split_whitespace()
        .map(normalize_token)
        .filter(|token| !is_filtered_token(token))
        .collect()
}

fn normalize_token(token: &str) -> String {
    token
        .to_lowercase()
        .chars()
        .filter(|character| character.is_alphanumeric() || *character == '\'')
        .collect::<String>()
}

fn is_filtered_token(token: &str) -> bool {
    token.is_empty() || token.len() < 2 || STOP_WORDS.contains(&token) || FILLER_WORDS.contains(&token) || NOISE_TOKENS.contains(&token)
}

fn analyze_sentiment(text: &str) -> SessionSentimentBreakdown {
    let analyzer = SentimentIntensityAnalyzer::new();
    let scores = analyzer.polarity_scores(text);
    let positive = scores.get("pos").copied().unwrap_or(0.0);
    let neutral = scores.get("neu").copied().unwrap_or(1.0);
    let negative = scores.get("neg").copied().unwrap_or(0.0);
    let compound = scores.get("compound").copied().unwrap_or(0.0);
    let label = if compound >= 0.05 {
        "positive"
    } else if compound <= -0.05 {
        "negative"
    } else {
        "neutral"
    };

    SessionSentimentBreakdown {
        positive,
        neutral,
        negative,
        compound,
        confidence: compound.abs(),
        label: label.to_string(),
    }
}

fn hydrate_sessions(history: &[HistoryItem]) -> Vec<HydratedSession> {
    history
        .iter()
        .filter_map(|item| {
            let text = item.text.trim();
            if text.is_empty() {
                return None;
            }

            let sentiment = analyze_sentiment(text);
            let effective_duration_ms = if item.effective_duration_ms > 0 {
                item.effective_duration_ms as u64
            } else {
                item.duration_ms.max(0) as u64
            };
            let derived = analyze_session(text, effective_duration_ms);

            Some(HydratedSession {
                text: text.to_string(),
                raw_word_count: if item.raw_word_count > 0 { item.raw_word_count as usize } else { derived.raw_word_count },
                clean_word_count: if item.clean_word_count > 0 { item.clean_word_count as usize } else { derived.clean_word_count },
                speaking_ms: item.speaking_ms.max(0) as u64,
                silence_ms: item.silence_ms.max(0) as u64,
                effective_duration_ms,
                time_saved_ms: if item.time_saved_ms > 0 { item.time_saved_ms as u64 } else { derived.time_saved_ms },
                sentiment: SessionSentimentBreakdown {
                    positive: sentiment.positive,
                    neutral: sentiment.neutral,
                    negative: sentiment.negative,
                    compound: if item.sentiment_compound != 0.0 { item.sentiment_compound } else { sentiment.compound },
                    confidence: if item.sentiment_confidence != 0.0 { item.sentiment_confidence } else { sentiment.confidence },
                    label: if item.sentiment_label.trim().is_empty() { sentiment.label } else { item.sentiment_label.clone() },
                },
                timestamp: parse_timestamp(&item.timestamp),
            })
        })
        .collect()
}

fn build_sentiment_summary(sessions: &[HydratedSession]) -> SentimentResult {
    let count = sessions.len().max(1) as f64;
    let positive = sessions.iter().map(|entry| entry.sentiment.positive).sum::<f64>() / count;
    let neutral = sessions.iter().map(|entry| entry.sentiment.neutral).sum::<f64>() / count;
    let negative = sessions.iter().map(|entry| entry.sentiment.negative).sum::<f64>() / count;
    let average_compound = sessions.iter().map(|entry| entry.sentiment.compound).sum::<f64>() / count;
    let average_confidence = sessions.iter().map(|entry| entry.sentiment.confidence).sum::<f64>() / count;
    let dominant_label = if positive >= neutral && positive >= negative {
        "positive"
    } else if negative >= positive && negative >= neutral {
        "negative"
    } else {
        "neutral"
    };

    SentimentResult {
        positive: (positive * 10000.0).round() / 100.0,
        neutral: (neutral * 10000.0).round() / 100.0,
        negative: (negative * 10000.0).round() / 100.0,
        average_compound: (average_compound * 100.0).round() / 100.0,
        average_confidence: (average_confidence * 100.0).round() / 100.0,
        dominant_label: dominant_label.to_string(),
    }
}

fn build_word_frequencies(sessions: &[HydratedSession], limit: usize) -> Vec<WordFreq> {
    let mut counts = HashMap::<String, usize>::new();
    let mut total = 0usize;
    for session in sessions {
        for token in cleaned_tokens(&session.text) {
            *counts.entry(token).or_insert(0) += 1;
            total += 1;
        }
    }

    let mut words = counts
        .into_iter()
        .map(|(word, count)| WordFreq {
            word,
            count,
            percentage: if total > 0 { ((count as f64 / total as f64) * 10000.0).round() / 100.0 } else { 0.0 },
        })
        .collect::<Vec<_>>();
    words.sort_by(|left, right| right.count.cmp(&left.count).then_with(|| left.word.cmp(&right.word)));
    words.truncate(limit);
    words
}

fn build_hourly_heatmap(sessions: &[HydratedSession]) -> Vec<HourlyActivity> {
    let mut buckets = vec![(0usize, 0usize); 24];
    for session in sessions {
        if let Some(timestamp) = session.timestamp.as_ref() {
            let index = timestamp.hour() as usize;
            buckets[index].0 += session.clean_word_count;
            buckets[index].1 += 1;
        }
    }

    let max_words = buckets.iter().map(|(words, _)| *words).max().unwrap_or(0).max(1) as f64;
    buckets
        .into_iter()
        .enumerate()
        .map(|(hour, (words, sessions))| HourlyActivity {
            hour: format!("{:02}:00", hour),
            words,
            sessions,
            intensity: ((words as f64 / max_words) * 100.0).round() / 100.0,
        })
        .collect()
}

fn build_yearly_heatmap(sessions: &[HydratedSession]) -> Vec<YearlyActivity> {
    let today = Local::now().date_naive();
    let start = today - Duration::days(364);
    let mut aggregates = HashMap::<NaiveDate, (usize, usize)>::new();

    for session in sessions {
        if let Some(timestamp) = session.timestamp.as_ref() {
            let date = timestamp.date_naive();
            if date >= start && date <= today {
                let entry = aggregates.entry(date).or_insert((0, 0));
                entry.0 += session.clean_word_count;
                entry.1 += 1;
            }
        }
    }

    let max_words = aggregates.values().map(|(words, _)| *words).max().unwrap_or(0).max(1) as f64;
    let mut cells = Vec::with_capacity(365);
    let mut cursor = start;
    while cursor <= today {
        let (words, sessions) = aggregates.get(&cursor).copied().unwrap_or((0, 0));
        let week_index = ((cursor - start).num_days() / 7) as usize;
        cells.push(YearlyActivity {
            date: cursor.format("%Y-%m-%d").to_string(),
            label: cursor.format("%d %b").to_string(),
            month: cursor.format("%b").to_string(),
            week_index,
            weekday: cursor.weekday().num_days_from_monday() as usize,
            words,
            sessions,
            intensity: ((words as f64 / max_words) * 100.0).round() / 100.0,
        });
        cursor += Duration::days(1);
    }
    cells
}

fn build_daily_trends(sessions: &[HydratedSession]) -> (Vec<DailyProductivity>, Vec<SentimentTrendPoint>) {
    let today = Local::now().date_naive();
    let start = today - Duration::days(13);
    let mut daily = BTreeMap::<NaiveDate, DailyAggregate>::new();

    for session in sessions {
        if let Some(timestamp) = session.timestamp.as_ref() {
            let date = timestamp.date_naive();
            if date >= start && date <= today {
                let entry = daily.entry(date).or_default();
                entry.words += session.clean_word_count;
                entry.saved_min += (session.time_saved_ms as f64 / 60000.0).round() as usize;
                entry.sessions += 1;
                entry.positive += session.sentiment.positive;
                entry.neutral += session.sentiment.neutral;
                entry.negative += session.sentiment.negative;
                entry.compound += session.sentiment.compound;
            }
        }
    }

    let mut productivity = Vec::with_capacity(14);
    let mut sentiment_trend = Vec::with_capacity(14);
    let mut cursor = start;
    while cursor <= today {
        let aggregate = daily.get(&cursor).cloned().unwrap_or_default();
        let count = aggregate.sessions.max(1) as f64;
        productivity.push(DailyProductivity {
            date: cursor.format("%Y-%m-%d").to_string(),
            label: cursor.format("%d %b").to_string(),
            words: aggregate.words,
            saved_min: aggregate.saved_min,
            sessions: aggregate.sessions,
        });
        sentiment_trend.push(SentimentTrendPoint {
            date: cursor.format("%Y-%m-%d").to_string(),
            positive: ((aggregate.positive / count) * 10000.0).round() / 100.0,
            neutral: ((aggregate.neutral / count) * 10000.0).round() / 100.0,
            negative: ((aggregate.negative / count) * 10000.0).round() / 100.0,
            compound: ((aggregate.compound / count) * 100.0).round() / 100.0,
        });
        cursor += Duration::days(1);
    }

    (productivity, sentiment_trend)
}

fn build_streak_summary(active_days: &BTreeSet<NaiveDate>) -> StreakSummary {
    let longest = longest_streak(active_days);
    let current = current_streak(active_days);
    let next_milestone = [3usize, 7, 14, 30, 50, 100, 180, 365]
        .into_iter()
        .find(|milestone| *milestone > current)
        .unwrap_or(current + 30);
    let reward_label = if current >= 100 {
        "Legendary consistency"
    } else if current >= 30 {
        "Momentum unlocked"
    } else if current >= 14 {
        "Two-week cadence"
    } else if current >= 7 {
        "Weekly rhythm"
    } else if current >= 3 {
        "Streak warming up"
    } else {
        "Start your first streak"
    };

    StreakSummary {
        current,
        longest,
        last_active_date: active_days.last().map(|date| date.format("%Y-%m-%d").to_string()),
        next_milestone,
        reward_label: reward_label.to_string(),
    }
}

fn current_streak(active_days: &BTreeSet<NaiveDate>) -> usize {
    let Some(&latest) = active_days.last() else {
        return 0;
    };
    let today = Local::now().date_naive();
    if latest != today && latest != today - Duration::days(1) {
        return 0;
    }

    let mut streak = 1usize;
    let mut cursor = latest;
    while active_days.contains(&(cursor - Duration::days(1))) {
        streak += 1;
        cursor -= Duration::days(1);
    }
    streak
}

fn longest_streak(active_days: &BTreeSet<NaiveDate>) -> usize {
    let mut longest = 0usize;
    let mut running = 0usize;
    let mut previous = None;
    for date in active_days {
        if let Some(last) = previous {
            if *date == last + Duration::days(1) {
                running += 1;
            } else {
                running = 1;
            }
        } else {
            running = 1;
        }
        longest = longest.max(running);
        previous = Some(*date);
    }
    longest
}

fn summarize_permission_alerts(permission_events: &[PermissionEvent]) -> Vec<PermissionAlertSummary> {
    let mut grouped = HashMap::<String, PermissionAlertSummary>::new();
    for event in permission_events {
        grouped
            .entry(event.permission_key.clone())
            .and_modify(|summary| {
                summary.count += 1;
                if event.timestamp.as_str() >= summary.last_seen.as_str() {
                    summary.last_seen = event.timestamp.clone();
                    summary.last_event_type = event.event_type.clone();
                    summary.last_message = event.message.clone();
                }
            })
            .or_insert(PermissionAlertSummary {
                permission_key: event.permission_key.clone(),
                count: 1,
                last_event_type: event.event_type.clone(),
                last_message: event.message.clone(),
                last_seen: event.timestamp.clone(),
            });
    }
    let mut summaries = grouped.into_values().collect::<Vec<_>>();
    summaries.sort_by(|left, right| right.last_seen.cmp(&left.last_seen));
    summaries
}

fn empty_hourly_heatmap() -> Vec<HourlyActivity> {
    (0..24)
        .map(|hour| HourlyActivity {
            hour: format!("{:02}:00", hour),
            words: 0,
            sessions: 0,
            intensity: 0.0,
        })
        .collect()
}

fn empty_yearly_heatmap() -> Vec<YearlyActivity> {
    let today = Local::now().date_naive();
    let start = today - Duration::days(364);
    let mut cells = Vec::with_capacity(365);
    let mut cursor = start;
    while cursor <= today {
        let week_index = ((cursor - start).num_days() / 7) as usize;
        cells.push(YearlyActivity {
            date: cursor.format("%Y-%m-%d").to_string(),
            label: cursor.format("%d %b").to_string(),
            month: cursor.format("%b").to_string(),
            week_index,
            weekday: cursor.weekday().num_days_from_monday() as usize,
            words: 0,
            sessions: 0,
            intensity: 0.0,
        });
        cursor += Duration::days(1);
    }
    cells
}

fn empty_recent_productivity() -> Vec<DailyProductivity> {
    let today = Local::now().date_naive();
    let start = today - Duration::days(13);
    let mut rows = Vec::with_capacity(14);
    let mut cursor = start;
    while cursor <= today {
        rows.push(DailyProductivity {
            date: cursor.format("%Y-%m-%d").to_string(),
            label: cursor.format("%d %b").to_string(),
            words: 0,
            saved_min: 0,
            sessions: 0,
        });
        cursor += Duration::days(1);
    }
    rows
}

fn empty_sentiment_trend() -> Vec<SentimentTrendPoint> {
    let today = Local::now().date_naive();
    let start = today - Duration::days(13);
    let mut rows = Vec::with_capacity(14);
    let mut cursor = start;
    while cursor <= today {
        rows.push(SentimentTrendPoint {
            date: cursor.format("%Y-%m-%d").to_string(),
            positive: 0.0,
            neutral: 100.0,
            negative: 0.0,
            compound: 0.0,
        });
        cursor += Duration::days(1);
    }
    rows
}

fn parse_timestamp(value: &str) -> Option<chrono::DateTime<Local>> {
    let parsed = NaiveDateTime::parse_from_str(value, "%Y-%m-%d %H:%M:%S").ok()?;
    Local
        .from_local_datetime(&parsed)
        .single()
        .or_else(|| Local.from_local_datetime(&parsed).earliest())
}

fn csv_escape(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}

fn trim_text(value: &str, max_len: usize) -> String {
    if value.chars().count() <= max_len {
        return value.to_string();
    }
    let mut trimmed = value.chars().take(max_len.saturating_sub(1)).collect::<String>();
    trimmed.push('…');
    trimmed
}

fn escape_pdf_text(value: &str) -> String {
    value.replace('\\', "\\\\").replace('(', "\\(").replace(')', "\\)")
}

fn build_simple_pdf(lines: &[String]) -> Vec<u8> {
    let mut content = String::new();
    content.push_str("BT\n/F1 12 Tf\n50 790 Td\n15 TL\n");
    for line in lines.iter().take(42) {
        content.push_str(&format!("({}) Tj\nT*\n", escape_pdf_text(line)));
    }
    content.push_str("ET\n");

    let objects = vec![
        "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n".to_string(),
        "2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n".to_string(),
        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n".to_string(),
        "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n".to_string(),
        format!("5 0 obj << /Length {} >> stream\n{}endstream\nendobj\n", content.as_bytes().len(), content),
    ];

    let mut pdf = Vec::new();
    pdf.extend_from_slice(b"%PDF-1.4\n");
    let mut offsets = Vec::with_capacity(objects.len());
    for object in &objects {
        offsets.push(pdf.len());
        pdf.extend_from_slice(object.as_bytes());
    }

    let xref_position = pdf.len();
    pdf.extend_from_slice(format!("xref\n0 {}\n", objects.len() + 1).as_bytes());
    pdf.extend_from_slice(b"0000000000 65535 f \n");
    for offset in offsets {
        pdf.extend_from_slice(format!("{:010} 00000 n \n", offset).as_bytes());
    }
    pdf.extend_from_slice(format!("trailer << /Size {} /Root 1 0 R >>\nstartxref\n{}\n%%EOF", objects.len() + 1, xref_position).as_bytes());
    pdf
}
