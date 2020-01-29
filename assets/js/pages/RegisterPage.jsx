import React,  {useState} from 'react';
import Field from '../components/Forms/Field';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import usersAPI from '../services/usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = ({history}) => {
    
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    })
    
    // Gestion des changements des inputs dans le formulaire 
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget
        setUser({...user, [name]: value})
    }

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {

        const apiErrors = {}

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original"
            setErrors(apiErrors)
            toast.error("Des erreurs dans votre formulaire")
            return
        }

        event.preventDefault()
        try {
            await usersAPI.register(user)
            setErrors({})
            toast.success("Vous êtes désormais inscrit, vous pouvez vous connectez !")
            history.replaceState("/login")
        } catch (error) {
            const {violations} = error.response.data

            if(violations){
                
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                })
                setErrors(apiErrors)
            }
            toast.error("Des erreurs dans votre formulaire")
        }
    }

    return ( 
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field 
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field 
                    name="email"
                    label="Email"
                    placeholder="Votre email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    type="password"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field 
                    name="passwordConfirm"
                    label="Confirmation du mot de passe"
                    placeholder="Confirmation de votre mot de passe"
                    type="password"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>

        </>
    );
}
 
export default RegisterPage;