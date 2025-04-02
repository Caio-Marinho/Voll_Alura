import styled from "styled-components";
import CampoDigitacao from "../../components/CampoDigitacao";
import {useState} from 'react';
import Botao from "../../components/Botao";
import { Link, useNavigate } from "react-router-dom";
import logo from './Logo.png';
import usePost from "../../usePost";
import autenticaStore from "../../stores/autentica.store";

const Imagem = styled.img`
  padding: 2em 0;
`;

const Titulo = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: var(--cinza)
`;

const Paragrafo = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: var(--azul-escuro)
`;

const ParagrafoCadastro = styled(Paragrafo)`
  color: var(--cinza);
`;

const LinkCustomizado = styled(Link)`
  color: var(--azul-claro);
  font-weight: 700;
  text-decoration: none;
`;

const Formulario = styled.form`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BotaoCustomizado = styled(Botao)`
  width: 50%;
`;

const ContainerFilho = styled.div`
width: 100%;
heeight: 100vh;
padding: 5em 0;
display: flex;
flex-direction: column;
align-items: center;
`

interface ILogin  {
  email: string,
  senha: string
}

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const {cadastrarDados, erro, sucesso, resposta} = usePost();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const usuario: ILogin = {
        email: email,
        senha: senha
      }

      try {
        cadastrarDados({ url: "auth/login", dados: usuario})
        autenticaStore.login({email: email, token: resposta})
        resposta && navigate('/dashboard')
      } catch (erro) {
        erro && alert('Não foi possível fazer login')
      }

    }

    return (
        <ContainerFilho>
        <Imagem src={logo} alt="Logo da Voll" />
        <Titulo>Faça login em sua conta</Titulo>
        <Formulario onSubmit={handleLogin}>
            <CampoDigitacao tipo="email" label="Email" valor={email} placeholder="Insira seu endereço de email" onChange={setEmail} />
            <CampoDigitacao tipo="password" label="Senha" valor={senha} placeholder="Insira sua senha" onChange={setSenha} />
            <BotaoCustomizado type="submit">Entrar</BotaoCustomizado>
        </Formulario>
        <Paragrafo>Esqueceu sua senha?</Paragrafo>
        <ParagrafoCadastro>Ainda não tem conta? <LinkCustomizado to="/cadastro">Faça seu cadastro!</LinkCustomizado></ParagrafoCadastro>
        </ContainerFilho>  
    )
}