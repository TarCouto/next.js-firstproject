import { AppProps } from "next/app"
import { globalStyles } from "../styles/Global"
import logoImg from "../assets/logo.svg"
import { Container, Header } from "../styles/Pages/app"
import Image from 'next/image'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={logoImg} alt="" />
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}
