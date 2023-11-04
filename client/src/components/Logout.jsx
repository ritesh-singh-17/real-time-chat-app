import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    try{
      const id = await JSON.parse(
        localStorage.getItem("chat-user")
      )._id;
      console.log(id);
      const data = await axios.get(`${logoutRoute}/${id}`);
      console.log(data);
      if (data.status === 200) {
        localStorage.clear();
        navigate("/login");
      }
    }catch(e){
      console.log("error in logging out");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
