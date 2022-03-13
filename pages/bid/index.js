import Head from 'next/head'
import Nav from "../../components/Nav";
import InputNumber from "../../components/InputNumber";
import Button from "../../components/Button";
import React from "react";
import Link from "next/link";

export default function Index() {
  const [bidDefined, setBidDefined] = React.useState(false);
  
  const [amount, setAmount] = React.useState(0);
  
  function handleSatsInput(e){
    if(e > 0) setBidDefined(true);
    setAmount(e);
  }
  
  return (
    <div className="h-screen w-full">
      <Head>
        <title>Bid - PlebFM</title>
        <meta name="description" content="placeholder screen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center h-full w-full p-8 space-y-16">
        <Nav text="Search" />
        
        <div className="drop-shadow-md space-y-2 w-full text-left">
          <h1 className="text-6xl">Freedom</h1>
          
          <p className="text-2xl font-bold">Rage Against the Machine</p>
          
          <p>Rage Against the Machine</p>
        </div>
        
        <InputNumber value="" parentCallback={handleSatsInput} />
        
        <Link href={{pathname: "/checkout", query: {amount}}} passHref>
          <Button text="Checkout" icon="CartIcon" active={bidDefined} />
        </Link>
      </main>
    </div>
  )
}