import "./ReadingPractice.css";

function ReadingPractice() {
  return (
    <div className="reading_practice_container">

      {/* TOP SECTION */}
      <div className="reading_practice_top">
        <div className="reading-left">

          <div className="reading_heading_container">

            <div className="reading_practice">
              <i className="fa-solid fa-book-open"></i>
              <h2>READING PRACTICE</h2>
            </div>

            <div className="fill_blanks_title">
              <h3>Fill in the blanks</h3>
              <span>(Dropdown)</span>
            </div>

          </div>

          <p>Find the word that makes each sentence fit.</p>

          {/* CATEGORY AND SEARCH */}
          <div className="category_search_container">

            <div className="category_question_container">
              <p className="category_title">
                Category &amp; Question Set
              </p>

              <div className="dropdown">
                <select
                  name="question_set"
                  id="question_set"
                  defaultValue="science"
                >
                  <option value="science">
                    Science &amp; Technology · Question set (70)
                  </option>
                  <option value="1">Question no 1</option>
                  <option value="2">Question no 2</option>
                  <option value="3">Question no 3</option>
                  <option value="4">Question no 4</option>
                </select>
              </div>
            </div>

            <div className="reading-right">
              <p className="search_title">Search Questions</p>

              <div className="fill_blanks_search">
                <i className="fa-solid fa-magnifying-glass"></i>

                <input
                  type="search"
                  placeholder="Search questions by title, keyword or question number..."
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom_section_reading">

        <div className="question_header">
          <p className="question_number">
            Question 1 of 70
          </p>
        </div>

        {/* QUESTION TITLE */}
        <div className="question_title">
          <h3>RESULTANT FORCE</h3>
          <span className="difficulty">Medium</span>
        </div>

        {/* QUESTION DETAILS */}
        <div className="question_details">

          <div className="question_detail">
            <img src="/assets/icons/clock.svg" alt="Clock" />
            <span>00:14</span>
          </div>

          <div className="question_detail">
            <img src="/assets/icons/blanks.svg" alt="Blanks" />
            <span>4 BLANKS</span>
          </div>

          <div className="question_detail">
            <img src="/assets/icons/category.svg" alt="Category" />
            <span>SCIENCE &amp; TECHNOLOGY</span>
          </div>

        </div>

        {/* QUESTION CONTENT */}
        <div className="question_content">
          <p>
            The overall result of two or{" "}

            <select className="blank_dropdown" defaultValue="">
              <option value="">Select</option>
              <option value="less">less</option>
              <option value="more">more</option>
              <option value="equal">equal</option>
            </select>

            {" "}forces acting on an object is called the resultant force.
            The resultant of two forces is a single force,
            which has the same effect as the two forces combined.

            {" "}If two forces pull an object in{" "}

            <select className="blank_dropdown" defaultValue="">
              <option value="">Select</option>
              <option value="both">both</option>
              <option value="opposite">opposite</option>
              <option value="same">same</option>
            </select>

            {" "}directions, the size of the resultant can be found by{" "}

            <select className="blank_dropdown" defaultValue="">
              <option value="">Select</option>
              <option value="keeping">keeping</option>
              <option value="subtracting">subtracting</option>
              <option value="adding">adding</option>
            </select>

            {" "}one force from the other. If the forces are{" "}

            <select className="blank_dropdown" defaultValue="">
              <option value="">Select</option>
              <option value="likely">likely</option>
              <option value="equal">equal</option>
              <option value="different">different</option>
            </select>

            {", they balance each other."}
          </p>
        </div>

      </div>
    </div>
  );
}

export default ReadingPractice;