import axios from "axios";

const baseURL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "ec2-54-167-138-30.compute-1.amazonaws.com:8080";

console.log(baseURL);
export default axios.create({
    baseURL: baseURL,
    headers: {"ngrok-skip-browser-warning": "true"},
});
