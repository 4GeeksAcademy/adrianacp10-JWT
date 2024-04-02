import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Logedin = () => {
return(
    <div>
        <h2>Ya estás dentro</h2>
    </div>
)
}