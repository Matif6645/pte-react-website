import { useEffect, useRef, useState } from "react";
import PracticeShared from "../PracticeShared.jsx";
import AiEvaluationResultReadAloud from "./AiEvaluationResultReadAloud.jsx";
import { scoreReadAloud } from "../../admin/aiScore.js";
import { addSubmission, updateSubmission } from "../../admin/submissonStore.js";
import "./ReadAloud.css";

// =====================================
// DEFAULT QUESTIONS
// =====================================

const defaultQuestions = [
  {
    id: 801,
    title: "TECHNOLOGY",
    difficulty: "Easy",
    time: "00:40",
    category: "SCIENCE & TECHNOLOGY",
    questionText:
      "Technology has transformed the way people communicate and access information.",
  },
];

// =====================================
// CONVERT AUDIO TO BASE64 (for the server)
// =====================================

// =====================================
// READ ALOUD COMPONENT
// =====================================

export default function ReadAloud({ onBack }) {
  const [index, setIndex] = useState(0);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // AI scoring state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Refs
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioUrlRef = useRef("");
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const recordingRequestRef = useRef(0);
  const submitRequestRef = useRef(0);

  const question = defaultQuestions[index];

  // =====================================
  // HELPER FUNCTIONS
  // =====================================

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  }

  function clearTimer() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  }

  function clearAudio() {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }

    setAudioUrl("");
    setAudioBlob(null);
  }

  // =====================================
  // CLEAN UP ON PAGE EXIT
  // =====================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      recordingRequestRef.current += 1;
      submitRequestRef.current += 1;

      clearTimer();

      const recorder = recorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = null;
        recorder.stop();
      }

      stopStream();

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = "";
      }
    };
  }, []);

  // =====================================
  // START RECORDING
  // =====================================

  async function startRecording() {
    if (
      isRecording ||
      submitted ||
      aiLoading ||
      recorderRef.current?.state === "recording"
    ) {
      return;
    }

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setError("Your browser does not support microphone recording.");
      return;
    }

    const requestId = ++recordingRequestRef.current;

    try {
      setError("");
      clearAudio();
      setRecordingTime(0);
      chunksRef.current = [];

      // Ask for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Student may have left the page while
      // microphone permission was being requested.
      if (!mountedRef.current || requestId !== recordingRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      // Collect recorded audio
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Create the audio file when recording stops
      recorder.onstop = () => {
        clearTimer();
        stopStream();

        if (!mountedRef.current) return;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        if (blob.size === 0) {
          setError("No audio recorded. Please try again.");
          setIsRecording(false);
          return;
        }

        const url = URL.createObjectURL(blob);

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }

        audioUrlRef.current = url;

        setAudioUrl(url);
        setAudioBlob(blob);
        setIsRecording(false);
      };

      recorder.onerror = () => {
        clearTimer();
        stopStream();
        setIsRecording(false);
        setError("Recording failed. Please try again.");
      };

      recorder.start();
      setIsRecording(true);

      // Display recording duration
      clearTimer();

      timerRef.current = setInterval(() => {
        setRecordingTime((previous) => previous + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);

      stopStream();
      clearTimer();

      if (mountedRef.current && requestId === recordingRequestRef.current) {
        setIsRecording(false);
        setError(
          "Microphone access failed. Please allow microphone permission.",
        );
      }
    }
  }

  // =====================================
  // STOP RECORDING
  // =====================================

  function stopRecording() {
    const recorder = recorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
    }

    clearTimer();
    setIsRecording(false);
  }

  // =====================================
  // RESET / RECORD AGAIN
  // =====================================

  function resetRecording() {
    recordingRequestRef.current += 1;

    // Ignore any AI result that is still on its way
    submitRequestRef.current += 1;

    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }

    recorderRef.current = null;

    stopStream();
    clearTimer();
    clearAudio();

    chunksRef.current = [];

    setIsRecording(false);
    setRecordingTime(0);
    setSubmitted(false);
    setAiLoading(false);
    setAiResult(null);
    setError("");
  }

  // =====================================
  // SUBMIT RECORDING FOR AI SCORING
  //
  // 1. Recording (audioBlob) -> base64
  // 2. Sent to Express: /api/score-read-aloud
  // 3. Whisper creates the transcript
  // 4. GPT compares it with the passage (READ_ALOUD_PROMPT)
  // 5. Server validates the result (getReadAloudResult)
  // 6. Result is shown below
  // =====================================

  async function handleSubmit() {
    if (!audioBlob || isRecording || submitted || aiLoading) {
      return;
    }

    const requestId = ++submitRequestRef.current;

    setAiLoading(true);
    setAiResult(null);
    setError("");

    // Save the attempt for the admin dashboard
    const item = addSubmission({
      type: "read-aloud",
      questionId: question.id,
      questionTitle: question.title,
      difficulty: question.difficulty,
      category: question.category,
      prompt: question.questionText,
    });

    try {
      const data = await scoreReadAloud(audioBlob, question.questionText);

      updateSubmission(item.id, {
        status: "ai-scored",
        answerText: data.transcript,
        score: data.score,
        maxScore: data.maxScore,
        criteria: data.criteria,
        feedback: data.feedback,
        missingWords: data.missingWords,
        incorrectWords: data.incorrectWords,
        addedWords: data.addedWords,
        suggestions: data.suggestions,
      });

      // Student pressed Reset or left the page meanwhile
      if (!mountedRef.current || requestId !== submitRequestRef.current) {
        return;
      }

      setAiResult(data);
      setSubmitted(true);
    } catch (err) {
      console.error("Read Aloud scoring failed:", err);

      updateSubmission(item.id, {
        status: "ai-error",
        feedback: err.message || "AI scoring failed",
      });

      if (mountedRef.current && requestId === submitRequestRef.current) {
        setError(
          `${err.message || "AI scoring failed"}. You can click Submit again to retry.`,
        );
      }
    } finally {
      if (mountedRef.current && requestId === submitRequestRef.current) {
        setAiLoading(false);
      }
    }
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <PracticeShared
      headingLabel="SPEAKING PRACTICE"
      title="Read Aloud"
      description="Read the text aloud clearly into your microphone."
      icon="fa-solid fa-microphone"
      question={question}
      questionNumber={index + 1}
      totalQuestions={defaultQuestions.length}
      categories={["SCIENCE & TECHNOLOGY"]}
      selectedCategory="SCIENCE & TECHNOLOGY"
      categoryCounts={{
        "SCIENCE & TECHNOLOGY": 1,
      }}
      onCategoryChange={() => {
        resetRecording();
        setIndex(0);
      }}
      search=""
      onSearchChange={() => {}}
      details={[
        {
          icon: "fa-regular fa-clock",
          text: "PREPARATION: 40 SEC",
        },
        {
          icon: "fa-solid fa-microphone",
          text: "SPEAKING",
        },
      ]}
      onBack={onBack}
      onReset={resetRecording}
      resetDisabled={!audioBlob && !isRecording && !submitted}
      onCheck={handleSubmit}
      checkLabel={aiLoading ? "Scoring..." : submitted ? "Submitted" : "Submit"}
      checkDisabled={!audioBlob || isRecording || submitted || aiLoading}
      onPrevious={() => {
        if (index > 0) {
          resetRecording();
          setIndex(index - 1);
        }
      }}
      onNext={() => {
        if (index < defaultQuestions.length - 1) {
          resetRecording();
          setIndex(index + 1);
        }
      }}
      previousDisabled={index === 0}
      nextDisabled={index === defaultQuestions.length - 1}
    >
      {/* =====================================
          READ ALOUD QUESTION
      ===================================== */}

      <div className="speaking_question">
        <h3>Read the following text aloud</h3>

        <p>{question.questionText}</p>

        <p>
          Click Start Recording, read the passage clearly, and then stop the
          recording.
        </p>
      </div>

      {/* =====================================
          MICROPHONE RECORDING AREA
      ===================================== */}

      <div className="readaloud_recorder">
        {/* MICROPHONE ICON */}
        <div className={`readaloud_mic_icon ${isRecording ? "recording" : ""}`}>
          <i className="fa-solid fa-microphone" />
        </div>

        {/* RECORDING STATUS */}
        <p className="readaloud_status">
          {isRecording
            ? `Recording: ${formatTime(recordingTime)}`
            : aiLoading
              ? "AI is evaluating your recording..."
              : submitted
                ? "Recording submitted"
                : audioBlob
                  ? `Recording ready: ${formatTime(recordingTime)}`
                  : "Microphone ready"}
        </p>

        {/* RECORDING BUTTONS */}
        <div className="readaloud_controls">
          {!isRecording ? (
            <button
              type="button"
              className="readaloud_btn"
              onClick={startRecording}
              disabled={submitted || aiLoading}
            >
              <i className="fa-solid fa-microphone" />

              {audioBlob ? "Record Again" : "Start Recording"}
            </button>
          ) : (
            <button
              type="button"
              className="readaloud_btn stop"
              onClick={stopRecording}
            >
              <i className="fa-solid fa-stop" />
              Stop Recording
            </button>
          )}

          {audioBlob && !submitted && !aiLoading && (
            <button
              type="button"
              className="readaloud_btn"
              onClick={resetRecording}
            >
              <i className="fa-solid fa-rotate-right" />
              Reset
            </button>
          )}
        </div>

        {/* AUDIO PLAYBACK */}
        {audioUrl && (
          <div className="readaloud_playback">
            <audio controls src={audioUrl} preload="metadata" />
          </div>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="readaloud_error" role="alert">
          {error}
        </div>
      )}

      {/* AI LOADING MESSAGE */}
      {aiLoading && (
        <div className="readaloud_feedback">
          <strong>AI is listening to your recording...</strong>

          <p>This can take a few seconds.</p>
        </div>
      )}

      {/* AI RESULT */}
      {submitted && aiResult && (
        <AiEvaluationResultReadAloud result={aiResult} />
      )}
    </PracticeShared>
  );
}
