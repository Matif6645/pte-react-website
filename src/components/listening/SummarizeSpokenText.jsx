import ListeningPractice from "../ListeningPractice.jsx";

function SummarizeSpokenText({ onBack }) {
  return (
    <ListeningPractice
      title="Summarize Spoken Text"
      description="Listen to the audio recording and write a short summary of what you heard."
      onBack={onBack}
    />
  );
}

export default SummarizeSpokenText;
