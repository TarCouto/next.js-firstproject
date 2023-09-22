
import { useRouter } from "next/router"
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/Pages/product"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from 'next/image'
import Stripe from "stripe";
import { stripe } from "@/lib/stripe"
import axios from "axios";
import { useState } from "react";


interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {


  const [isCreatingCheckoutSesseion, setIsCreatingCheckoutSesseion ] = useState(false)



  async function handleProduct() {
    try {

      setIsCreatingCheckoutSesseion(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl

    } catch (err) {

      //Conectar com uma ferramenta de observabiliodade 
      alert('Falha ao rastrear o produto')


    }
  }

  function teste (){
    console.log(product.defaultPriceId)
  }
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button disabled={isCreatingCheckoutSesseion} onClick={handleProduct}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_MLH5Wy0Y97hDAC' } },
    ],
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  if (!params) {
    throw new Error("Params is undefined");
  }
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });
  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount as number / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1 // 1 hours
  }
}