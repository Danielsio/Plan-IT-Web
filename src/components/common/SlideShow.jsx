import React from 'react';
import {Fade} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const fadeImages = [
    {
        url: 'readme_objects/googleCalendarBefore.png',
        caption: 'Before'
    },
    {
        url: 'readme_objects/googleCalendarAfter.png',
        caption: 'After'
    },
];

export const Slideshow = () => {
    return (
        <div className="slide-container">
            <Fade>
                {fadeImages.map((fadeImage, index) => (
                    <div key={index}>
                        <img style={{width: '100%'}} src={fadeImage.url}/>
                        <h2>{fadeImage.caption}</h2>
                    </div>
                ))}
            </Fade>
        </div>
    )
}