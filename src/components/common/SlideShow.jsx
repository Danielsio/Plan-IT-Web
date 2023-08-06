import Carousel from 'react-bootstrap/Carousel';

function Slideshow() {
    return (
        <Carousel fade data-bs-theme="dark">
            <Carousel.Item>
                <div>
                    <img
                        className="d-block w-100"
                        src={import.meta.env.DEV ? "public/Before.png" : "../Before.png"}
                        alt="before-calendar"
                    />
                </div>
                <Carousel.Caption style={{color: "black"}}>
                    <h2>Before</h2>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div>
                    <img
                        className="d-block w-100"
                        src={import.meta.env.DEV ? "public/After.png" : "../After.png"}
                        alt="after-calendar"
                    />
                </div>
                <Carousel.Caption>
                    <h2 style={{color: "black"}}>After</h2>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Slideshow;
