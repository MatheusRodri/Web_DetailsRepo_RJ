import React from "react";
import { FaGithub, FaPlus } from "react-icons/fa"
import { Conteiner, Form, SubmitButton } from "./styled";


export default function Main() {
    return (
        <Conteiner>

            <h1>
                <FaGithub size={25} />
                My repositories
            </h1>
            <Form>
                <input type="text" placeholder="Add repository" />

                <SubmitButton>
                    <FaPlus size={20} color="#fff" />
                </SubmitButton>

            </Form>
        </Conteiner>
    )
} 