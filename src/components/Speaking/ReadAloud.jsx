
import { useState } from "react";
import PracticeShared from "../PracticeShared.jsx";
import "./ReadAloud.css";

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

export default function ReadAloud({ onBack }) {
  const [index, setIndex] = useState(0);

  const question = defaultQuestions[index];

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
      categoryCounts={{ "SCIENCE & TECHNOLOGY": 1 }}
      onCategoryChange={() => setIndex(0)}
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
      onReset={() => setIndex(0)}
      onCheck={() => {}}
      checkLabel="Submit"
      checkDisabled
      onPrevious={() => setIndex(Math.max(0, index - 1))}
      onNext={() =>
        setIndex(Math.min(defaultQuestions.length - 1, index + 1))
      }
      previousDisabled={index === 0}
      nextDisabled={index === defaultQuestions.length - 1}
    >
      <div className="speaking_question">
        <h3>Read the following text aloud</h3>

        <p>{question.questionText}</p>

        <p>
          Microphone recording and OpenAI evaluation
          will be added next.
        </p>
      </div>
    </PracticeShared>
  );
}
