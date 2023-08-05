import axios from "axios";

const baseURL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://planit-itay.onrender.com";

console.log(baseURL);
export default axios.create({
    baseURL: baseURL,
    headers: {"ngrok-skip-browser-warning": "true"},
});
