use crate::db::HistoryItem;
use serde::Serialize;
use vader_sentiment::SentimentIntensityAnalyzer;
use chrono::{NaiveDateTime, TimeZone, Timelike, Local};
use std::collections::HashMap;

#[derive(Serialize)]
pub struct AnalyticsOverview {
    pub total_words: usize,
    pub time_saved_min: usize,
    pub total_sessions: usize,
    pub avg_wpm: usize,
    pub current_streak: usize,
    pub sentiment: SentimentResult,
    pub top_words: Vec<WordFreq>,
    pub hourly_heatmap: Vec<HourlyActivity>,
    pub recent_productivity: Vec<DailyProductivity>,
}

#[derive(Serialize)]
pub struct SentimentResult {
    pub positive: f64,
    pub neutral: f64,
    pub negative: f64,
}

#[derive(Serialize)]
pub struct HourlyActivity {
    pub hour: String,
    pub words: usize,
}

#[derive(Serialize)]
pub struct WordFreq {
    pub word: String,
    pub count: usize,
}

#[derive(Serialize)]
pub struct DailyProductivity {
    pub name: String,
    pub words: usize,
    pub saved: usize,
}

// Stop words to ignore during frequency tracking
const STOP_WORDS: &[&str] = &["the", "is", "in", "at", "of", "on", "and", "a", "to", "it", "that", "this", "for", "with", "as", "was", "are"];

pub fn process_analytics(history: &[HistoryItem]) -> AnalyticsOverview {
    let total_sessions = history.len();
    if total_sessions == 0 {
        return AnalyticsOverview {
            total_words: 0,
            time_saved_min: 0,
            total_sessions: 0,
            avg_wpm: 0,
            current_streak: 0,
            sentiment: SentimentResult { positive: 0.0, neutral: 100.0, negative: 0.0 },
            top_words: vec![],
            hourly_heatmap: vec![],
            recent_productivity: vec![],
        };
    }

    let analyzer = SentimentIntensityAnalyzer::new();
    let mut total_words = 0;
    let mut total_duration_ms_for_wpm: u64 = 0;
    
    let mut pos_sum = 0.0;
    let mut neu_sum = 0.0;
    let mut neg_sum = 0.0;
    let mut scored_sessions = 0;

    let mut word_counts: HashMap<String, usize> = HashMap::new();
    let mut hourly_counts: HashMap<u32, usize> = HashMap::new();
    let mut daily_counts: HashMap<String, usize> = HashMap::new();

    for item in history {
        let text = item.text.trim();
        if text.is_empty() { continue; }
        
        // 1. Word Count calculation
        let words_in_item = text.split_whitespace().count();
        total_words += words_in_item;
        total_duration_ms_for_wpm += item.duration_ms as u64;

        // 2. Sentiment analysis per item
        let scores = analyzer.polarity_scores(text);
        if let (Some(pos), Some(neu), Some(neg)) = (scores.get("pos"), scores.get("neu"), scores.get("neg")) {
            pos_sum += pos;
            neu_sum += neu;
            neg_sum += neg;
            scored_sessions += 1;
        }

        // 3. Word frequencies
        for raw_word in text.split_whitespace() {
            let clean_word = raw_word.to_lowercase().chars().filter(|c| c.is_alphanumeric()).collect::<String>();
            if !clean_word.is_empty() && clean_word.len() > 2 && !STOP_WORDS.contains(&clean_word.as_str()) {
                *word_counts.entry(clean_word).or_insert(0) += 1;
            }
        }

        // 4. Heatmaps & Daily (using naive datetime from SQLite string "YYYY-MM-DD HH:MM:SS")
        if let Ok(parsed_time) = NaiveDateTime::parse_from_str(&item.timestamp, "%Y-%m-%d %H:%M:%S") {
            let local_time = Local.from_utc_datetime(&parsed_time);
            
            // Hourly heatmap
            let hour = local_time.hour();
            *hourly_counts.entry(hour).or_insert(0) += words_in_item;

            // Daily productivity
            let day_name = local_time.format("%a").to_string(); // e.g., "Mon"
            *daily_counts.entry(day_name).or_insert(0) += words_in_item;
        }
    }

    // Averages
    let avg_wpm = if total_duration_ms_for_wpm > 0 {
        let minutes = total_duration_ms_for_wpm as f64 / 60000.0;
        (total_words as f64 / minutes).round() as usize
    } else {
        0
    };

    // Time saved vs typing at 40 wpm
    let typing_time_min = total_words as f64 / 40.0;
    let dictation_time_min = total_duration_ms_for_wpm as f64 / 60000.0;
    let time_saved_min = if typing_time_min > dictation_time_min {
        (typing_time_min - dictation_time_min).round() as usize
    } else {
        0
    };

    let sentiment = if scored_sessions > 0 {
        let f = scored_sessions as f64;
        SentimentResult {
            positive: (pos_sum / f * 100.0).round(),
            neutral: (neu_sum / f * 100.0).round(),
            negative: (neg_sum / f * 100.0).round(),
        }
    } else {
        SentimentResult { positive: 0.0, neutral: 100.0, negative: 0.0 }
    };

    // Frequencies sort
    let mut top_words: Vec<WordFreq> = word_counts.into_iter().map(|(w, c)| WordFreq { word: w, count: c }).collect();
    top_words.sort_by(|a, b| b.count.cmp(&a.count));
    top_words.truncate(10); // Top 10 words

    // Hourly Format mapping (24 hours)
    let mut hourly_heatmap = Vec::new();
    for h in 0..24 {
        hourly_heatmap.push(HourlyActivity {
            hour: format!("{:02}:00", h),
            words: *hourly_counts.get(&h).unwrap_or(&0),
        });
    }

    // Last 7 days order formatting (Mon -> Sun conceptually, but we'll collect the data present)
    let days_order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let mut recent_productivity = Vec::new();
    for &d in days_order.iter() {
        let w = *daily_counts.get(d).unwrap_or(&0);
        recent_productivity.push(DailyProductivity {
            name: d.to_string(),
            words: w,
            saved: (w as f64 / 40.0).round() as usize, // approximate time saved for the chart
        });
    }

    // Simple Streak Calculation (assuming all history returned is recent, 
    // real streaks would group by discrete days starting from today backwards)
    let current_streak = if total_sessions > 0 { 1 } else { 0 }; // Simplified for now since we lack robust daily grouping without a deeper loop over unique dates

    AnalyticsOverview {
        total_words,
        time_saved_min,
        total_sessions,
        avg_wpm,
        current_streak,
        sentiment,
        top_words,
        hourly_heatmap,
        recent_productivity,
    }
}
