"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

import PaymentDialog from '@/components/learn-more/paymentdialog';

import { toast } from "@/components/ui/use-toast"
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import { createClient } from "@/utils/supabase/client"
import { useEffect } from "react"
import React from "react"
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_51MSCUvJxLu9kP7U0XRItcPfGXW01BgKv5Lj8XIceyy8EW54WEmyawwNWfEEw3SD6Si1FJWEiErOoegV7MF6q73M000b73VeZst');

const products = [
	{
		id: "prod_gold",
		name: "Upgrade to Gold",
		description: "Upgrade to the Gold package for exclusive benefits.",
		imageUrl: "/images/gold-package.jpg",
		price: 300
	},
	{
		id: "prod_expedited",
		name: "Expedited Service",
		description: "Get expedited service for faster results.",
		imageUrl: "/images/expedited-service.jpg",
		price: 100
	},
	{
		id: "prod_coaching",
		name: "30 Minute Coaching Call",
		description: "Get a 30 minute coaching call with our expert.",
		imageUrl: "/images/coaching-call.jpg",
		price: 50
	}
];

const OffersSection: React.FC = () => {

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  const openDialog = (product: string, productId: string) => {
    setSelectedProduct(product);
    setSelectedProductId(productId);
    setIsOpen(true);
  };

  const { user } = useSupabaseUser();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = user?.id;

      if (!userId) {
        return;
      }

      // Need a way here to fetch the user's purchase history and offer the appropriate products they can purchase

      const { data, error } = await supabase
        .from('purchases') 
        .select('*')
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "Error fetching notifications",
          description: error.message
        });
      } else {        
       
      }
    }

    fetchUser();
  }, [user])


  return (

    <div className="flex-1 flex flex-col w-full px-8 justify-center gap-2">
       <Elements stripe={stripePromise}>
        <PaymentDialog isOpen={isOpen} onOpenChange={setIsOpen} selectedProduct={selectedProduct} selectedProductId={selectedProductId} />
      </Elements>
      <Link
        href="/"
        className="text-2xl font-bold text-center text-slate-950"
      >
        Offers
      </Link>
      {products.map((product) => (
        <div key={product.id} className="mt-4 p-4 border rounded-lg shadow-sm w-full">
          {/* {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-md" />
          )} */}
          <h2 className="text-xl font-bold mt-2">{product.name}</h2>
          <p className="text-gray-700 mt-1">{product.description}</p>
          <p className="text-lg font-semibold mt-2">${product.price}</p>
          <button
            onClick={() => openDialog(product.name, product.id)}
            className="mt-4 bg-navyYellow hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded text-lg transition-colors duration-300 w-full"
          >
            Purchase
          </button>
        </div>
      ))}
    </div>
  )
};

export default OffersSection;
