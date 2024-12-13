'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';

const productSchema = z.object({
	name: z.string().nonempty("Name is required"),
	description: z.string().nonempty("Description is required"),
	price: z.number().positive("Price must be positive"),
	currency: z.string().default("USD"),
	type: z.enum(["one_time", "recurring"]),
	interval: z.string().optional(),
	interval_count: z.number().optional(),
	trial_period_days: z.number().optional(),
	image: z.string().optional(),
	active: z.boolean().optional(),
	metadata: z.object({
		purchase_rules: z.object({
			max_purchases: z.number().nullable(),
			user_can_purchase: z.boolean(),
			packages_that_can_purchase: z.array(z.string()).nullable(),
			allow_multiple: z.boolean()
		}),
		messages: z.object({
			not_eligible: z.string(),
			max_purchases_reached: z.string(),
			upgrade_required: z.string(),
			product_paused: z.string()
		})
	})
});

const AddProductDialog = () => {
	const { register, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: zodResolver(productSchema)
	});
	const [products, setProducts] = useState([]);

	useEffect(() => {
		// Fetch existing products
		const fetchProducts = async () => {
			const response = await fetch('/api/products');
			console.log("Products response:", response);
			const data = await response.json();
			setProducts(data);
		};
		fetchProducts();
	}, []);

	const onSubmit = async (data: any) => {
		data.active = true; // or set based on your form input
		data.image = ""; // or set based on your form input
		try {
			const response = await fetch('/api/products/product', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				throw new Error('Failed to add product');
			}
			alert('Product added successfully');
		} catch (error) {
			console.error(error);
			alert('Error adding product');
		}
	};

	const productOptions = products.map((product: any) => ({
		value: product.id,
		label: product.name
	}));

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add Product</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Product</DialogTitle>
					<DialogDescription>Fill in the details to add a new product</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-4">
						<div>
							<label htmlFor="name">Name</label>
							<Input id="name" {...register('name')} />
							{errors.name && <p className="text-red-500">{String(errors.name.message)}</p>}
						</div>
						<div>
							<label htmlFor="description">Description</label>
							<Textarea id="description" {...register('description')} />
							{errors.description && <p className="text-red-500">{String(errors.description.message)}</p>}
						</div>
						<div>
							<label htmlFor="price">Price (in pennies)</label>
							<Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
							{errors.price && <p className="text-red-500">{String(errors.price.message)}</p>}
						</div>
						<div>
							<label htmlFor="currency">Currency</label>
							<Input id="currency" {...register('currency')} />
						</div>
						<div>
							<label htmlFor="type">Type</label>
							<select id="type" {...register('type')}>
								<option value="one_time">One Time</option>
								<option value="recurring">Recurring</option>
							</select>
						</div>
						<div>
							<label htmlFor="interval">Interval</label>
							<Input id="interval" {...register('interval')} />
						</div>
						<div>
							<label htmlFor="interval_count">Interval Count</label>
							<Input id="interval_count" type="number" {...register('interval_count', { valueAsNumber: true })} />
						</div>
						<div>
							<label htmlFor="trial_period_days">Trial Period Days</label>
							<Input id="trial_period_days" type="number" {...register('trial_period_days', { valueAsNumber: true })} />
						</div>
						<div>
							<label htmlFor="not_eligible">Not Eligible Message</label>
							<Textarea id="not_eligible" {...register('metadata.messages.not_eligible')} />
						</div>
						<div>
							<label htmlFor="product_paused">Product Paused Message</label>
							<Textarea id="product_paused" {...register('metadata.messages.product_paused')} />
						</div>
						<div>
							<label htmlFor="upgrade_required">Upgrade Required Message</label>
							<Textarea id="upgrade_required" {...register('metadata.messages.upgrade_required')} />
						</div>
						<div>
							<label htmlFor="max_purchases_reached">Max Purchases Reached Message</label>
							<Textarea id="max_purchases_reached" {...register('metadata.messages.max_purchases_reached')} />
						</div>
						<div>
							<label htmlFor="max_purchases">Max Purchases</label>
							<Input id="max_purchases" type="number" {...register('metadata.purchase_rules.max_purchases', { valueAsNumber: true })} />
						</div>
						<div>
							<label htmlFor="user_can_purchase">User Can Purchase</label>
							<input type="checkbox" id="user_can_purchase" {...register('metadata.purchase_rules.user_can_purchase')} />
						</div>
						<div>
							<label htmlFor="packages_that_can_purchase">Packages that can purchase</label>
							<Select
								id="packages_that_can_purchase"
								options={productOptions}
								isMulti
								onChange={(selectedOptions) => setValue('metadata.purchase_rules.packages_that_can_purchase', selectedOptions ? selectedOptions.map((option) => option.value) : [])}
							/>
						</div>
						<div>
							<label htmlFor="allow_multiple">Allow Multiple</label>
							<input type="checkbox" id="allow_multiple" {...register('metadata.purchase_rules.allow_multiple')} />
						</div>
						<div>
							<label htmlFor="image">Image URL</label>
							<Input id="image" {...register('image')} />
						</div>
						<div>
							<label htmlFor="active">Active</label>
							<input type="checkbox" id="active" {...register('active')} />
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button">Cancel</Button>
						</DialogClose>
						<Button type="submit">Add Product</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddProductDialog;
