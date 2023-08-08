import React from 'react';
import {Fade} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import '../../styles/SlideShow.css';

const SlideShow = () => {

    return (
        <div>
            <Fade>
                <div className="each-slide">
                    <div>
                        <img className="slide-image"
                             src={import.meta.env.DEV ? "Before.png" : "../Before.png"}
                             alt="image-before"/>
                    </div>
                    <p>Before:<br/><br/>Unorganized Schedule</p>
                </div>
                <div className="each-slide">
                    <p>After: <br/><br/>A Smart Study Plan <br/>based on your preferences</p>
                    <div>
                        <img className="slide-image"
                             src={import.meta.env.DEV ? "After.png" : "../After.png"}
                             alt="image-After"/>
                    </div>
                </div>
            </Fade>
        </div>
    );
};

export default SlideShow;