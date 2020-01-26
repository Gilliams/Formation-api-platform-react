import Axios from "axios";
import JwtDecode from "jwt-decode";


/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete Axios.defaults.headers["Authorization"]
}   

/**
 * Requête HTTP d'authentification et stokage du token dans le storage et sur Axios
 * @param {object} credentials 
 */
function authenticate(credentials){
    return Axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
        // Je stocke le token dans mon localStorage
        window.localStorage.setItem("authToken", token)

        // On previent Axio que mnt on a un header par default sur toutes nos futures request HTTP
        setAxiosToken(token)
    });
}

/**
 * Position le token JWT sur Axios
 * @param {string} token JWT 
 */
function setAxiosToken(token){
    Axios.defaults.headers['Authorization'] = "Bearer " + token;
}


/**
 * Mise ne place lors du chargement de l'application
 */
function setup(){
    // Token ? 
    const token = window.localStorage.getItem("authToken");
    // Toujours valide ?
    if(token){
        const {exp: expiration} = JwtDecode(token)
        if(expiration * 1000 > new Date().getTime() ){
            setAxiosToken(token)
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp: expiration} = JwtDecode(token)
        if(expiration * 1000 > new Date().getTime() ){
            return true
        }
        return false
    }
    return false
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}