import React from "react";



function PageHeader({pageTitle}) {

    return (
        <>
            <h1 className="generate-calendar-title mt-4 ">{pageTitle}:</h1>
            <hr className="generate-calendar-hr"/>
        </>
    );
}

export default PageHeader;
