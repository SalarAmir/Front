import supabase from "../config/db.js";

export const getCart = async (request, reply) => {
    const {email} = request.query;
    
    try{
        let {data, error} = await supabase
        .from('cart')
        .select(`
            items, 
            user (id, email)
        `)
        .eq('user.email', email)
        .single();

        if (error) {
            if(error.code === "PGRST116"){
                return reply.send({ success: true, data:[] });
            }
        };

        if(data.user === null){
            return reply.send({ success: true, data:[] });
        }

        return reply.send({ success: true, data:data.items});
    }
    catch(err){
        console.error(err);
        reply.status(400).send({ success: false, error: err.message });
    }
}

export const addToCart = async (request, reply) => {
    const {email} = request.query;
    const item = request.body;
    console.log("from fe:",item);
    // const {}

    try{
        const {data:user, error:userError} = await supabase
        .from('user')
        .select('id, email')
        .eq('email', email)
        .single();
        // if (userError) throw userError;

        const {data:cartData, error:cartError} = await supabase
        .from('cart')
        .select(`
            items
        `)
        .eq('user_id', user.id)
        .single();

        // if (cartError) throw cartError;
        
        if (!cartData || cartData.length === 0){
            //create new cart and insert item
            console.log("Creating new cart");
            const {data:insertData, error:insertError} = await supabase
            .from('cart')
            .insert({
                user_id:user.id,
                items:[
                    {...item, quantity:1},
                ]
            })
            if(insertError) throw  insertError;

            console.log(insertData);
            return reply.send({ success: true, data:insertData });

        }

        //update existing cart
        console.log("Updating existing cart");
        let itemExists = false;
        let updatedItems = cartData.items.map(cartItem=>{
            if (cartItem.product === item.product){
                cartItem.quantity += 1;
                itemExists = true;
            }
            return cartItem;
        });

        //insert new item if it doesn't exist in cart
        if (!itemExists){
            updatedItems.push({
                ...item,
                quantity:1
            });
        }

        
        const {data:updateData, error:updateError} = await supabase
        .from('cart')
        .update({
            items:updatedItems
        })
        .eq('user_id', user.id)
        .single();
        
        if(updateError) throw updateError;
        // console.log(cartData);

        return reply.send({ success: true, data:updateData });
    }
    catch(err){
        console.error(err);
        reply.status(400).send({ success: false, error: err.message });
    }

}

export const removeFromCart = async (request, reply) => {
    const {email} = request.query;
    const {productName:itemName} = request.body;
    // console.log("from fe:",item);
    // // const {}

    try{
        const {data:user} = await supabase
        .from('user')
        .select('id, email')
        .eq('email', email)
        .single();

        const {data:cartData} = await supabase
        .from('cart')
        .select(`
            items
        `)
        .eq('user_id', user.id)
        .single();
        
        if (!cartData || cartData.length === 0){
            return reply.send({ success: true, data:[] });
        }

        //update existing cart
        console.log("Updating existing cart");
        let updatedItems = cartData.items.filter(cartItem=>cartItem.product !== itemName);
        
        const {data:updateData} = await supabase
        .from('cart')
        .update({
            items:updatedItems
        })
        .eq('user_id', user.id)
        .single();

        return reply.send({ success: true, data:updateData });

    }
    catch(err){
        console.error(err);
    }
}