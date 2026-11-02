import "./listeningPractice.css"

function ListeningPractice( {
    title , description , icon = "", onBack, children,
}){
    return (
        <div className="listening_practice_page">
            {
                onBack && (
                     <button type="button" className="listening_back_btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          Back
        </button>
                )}

        <div className="listening_heading_row">
            <i className={icon}></i>
            <h2>LISTENING PRACTICE</h2>
        </div>

        <h3 className="listening_title">{title}</h3>
        <p className="listening_description">{description}</p>

        <div className="listening_content_card">
            { children || (
                <p className="listening_placeholder">
                     This practice page is ready. Next we will add audio and questions
            here.
                </p>
            )}
        </div>
        </div>
    )
}

export default ListeningPractice;