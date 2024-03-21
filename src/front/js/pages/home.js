import { Context } from "../store/appContext";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const SignUp = () => {
	const { actions, store } = useContext(Context);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [alertMessage, setAlertMessage] = useState("");

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			setAlertMessage("Todos los campos son obligatorios");
			return;
		}
		try {
			await actions.signUp(formData);
			setAlertMessage("Usuario creado correctamente");
			setFormData({
				email: "",
				password: "",
			});
		} catch (error) {
			if (error.message === "The email is already in use") {
				setAlertMessage("El correo electrónico ya está en uso");
			} else {
				setAlertMessage("Error al crear el usuario");
				console.error("Error al crear el usuario:", error);
			}
		}
	};

	return (
		<div className="signUpStyles d-flex">
			<div className="container signUp col-6">
				<form onSubmit={handleSubmit} >
					<h1 className="title mb-3">Registrate</h1>
					<div className="textSignUp">
						<div>
							<label className="form-label">Correo electrónico</label>
							<input type="email" className="form-control inputSignUp" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="current-user_name" />
						</div>
						<div className="mb-2">
							<label className="form-label">Contraseña</label>
							<input type="password" className="form-control inputSignUp" id="password" name="password" value={formData.password} onChange={handleChange} autoComplete="current-password" />
						</div>
						<div>
							<span>Ya estas registrado ? <Link to="/login" className="link"> Iniciar Sesion</Link></span>
						</div>
					</div>
					<button type="submit" className="btn btn-primary ">Registrarse</button>
					{alertMessage && (
						alertMessage === "Usuario creado correctamente" ? (
							<div className="alert alert-success mt-3">{alertMessage}</div>
						) : (
							<div className="alert alert-danger mt-3">{alertMessage}</div>
						)
					)}
				</form>
			</div>

		</div >
	);
};
