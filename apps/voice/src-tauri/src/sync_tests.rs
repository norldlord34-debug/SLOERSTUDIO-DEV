#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;
    use std::path::PathBuf;

    // Simulate audio data at 16kHz
    fn generate_dummy_audio(seconds: f32) -> Vec<f32> {
        let samples = (seconds * 16000.0) as usize;
        vec![0.0; samples] // Silence is fine for measuring inference cold/warm latency
    }

    // A helper to measure generic transcribe latency
    async fn measure_transcription_latency(seconds: f32) -> std::time::Duration {
        // Initialize or get model path
        let data_dir = PathBuf::from(".");
        let model_path = crate::whisper::ensure_model(&data_dir).await.unwrap_or(data_dir.join("ggml-base.en.bin"));
        
        let audio = generate_dummy_audio(seconds);
        
        let start = Instant::now();
        // Run inference
        let _ = crate::whisper::transcribe(&model_path, &audio);
        start.elapsed()
    }

    #[tokio::test]
    async fn test_sync_latency_5s_clip() {
        let elapsed = measure_transcription_latency(5.0).await;
        println!("5s Clip Latency: {:?}", elapsed);
        
        // This validates if the inference engine is able to process chunks fast enough 
        // We assert loosely to account for CI/development machines doing full CPU inference without GPU
        assert!(elapsed.as_millis() < 15000, "Inference for 5s took too long");
    }

    #[tokio::test]
    async fn test_sync_latency_10s_clip() {
        let elapsed = measure_transcription_latency(10.0).await;
        println!("10s Clip Latency: {:?}", elapsed);
        assert!(elapsed.as_millis() < 30000, "Inference for 10s took too long");
    }

    #[tokio::test]
    async fn test_sync_latency_30s_clip() {
        let elapsed = measure_transcription_latency(30.0).await;
        println!("30s Clip Latency: {:?}", elapsed);
        assert!(elapsed.as_millis() < 80000, "Inference for 30s took too long");
    }
}
