import React from "react";
import {Button} from "react-bootstrap";
import {FiChevronDown, FiChevronUp} from "react-icons/fi"; // Import icons for Show More/Show Less
import "../../styles/adminDashboard.css";


function ShowMoreLessButton({showDetails, setShowDetails}) {


    return (
        <Button className="btn-show-more-less-button" style={{paddingLeft:"0", paddingTop:"1rem"}} variant="link" onClick={() => setShowDetails((prev) => !prev)}>
            {showDetails ? (
                <>
                    Show Less <FiChevronUp/> {/* Show icon for Show Less */}
                </>
            ) : (
                <>
                    Show More <FiChevronDown/> {/* Show icon for Show More */}
                </>
            )}
        </Button>
    );
}

export default ShowMoreLessButton;
