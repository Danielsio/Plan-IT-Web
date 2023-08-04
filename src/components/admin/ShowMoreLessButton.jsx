import React, {useContext, useState} from "react";
import {Card, Button, Collapse, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FiChevronDown, FiChevronUp} from "react-icons/fi"; // Import icons for Show More/Show Less
import "../../styles/adminDashboard.css";
import api from "../../api/axiosBackendConfig.js";
import {UserContext} from "../../context/UserContext.jsx";
import {toast} from "react-toastify";
import DeleteCourseConfirmationModal from "./DeleteCourseConfirmationModal.jsx";


function ShowMoreLessButton({showDetails, setShowDetails}) {


    return (
        <Button style={{paddingLeft:"0", paddingTop:"1rem"}} variant="link" onClick={() => setShowDetails((prev) => !prev)}>
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
