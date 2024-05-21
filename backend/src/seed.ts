import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main () {
    const users = [{
            username: "sundaram",
            email: "sundaram123@gmail.com",
            password: "$2b$10$FoIemzH8f6DaCgnRGtAGdel6qIF07.kRE/z8Q5VTWTWq8Q7D3mnn2"
        }, {
            username: "anonybro@123",
            email: "anonybro@gmail.com",
            password: "$2b$10$sVlFM0MhwBEhbBUTl0sWD.sIFIxVuWANlYnVpW/kIxU6XIjDe3to6"
        }, {
            username: "yuvraj69",
            email: "yuvraj123@gmail.com",
            password: "$2b$10$pMPXMxn2dHtH4NDhNotDA.jffjBVKoAQgpbOkN6Rqa5/G7YgaLJUO"
        }
    ]

    // create users
    const createdUsers = await Promise.all(
        users.map(async (user) => {
            return await prisma.user.create({
                data: user
            })
        })
    )

    
    const messages = [{
            username: "sundaram",
            text: "Hello yuvraj",
            timeStamp: "21/5/2024, 1:46:16 pm"
        }, {
            username: "yuvraj69",
            text: "Hello sundaram",
            timeStamp: "5/21/2024, 7:26:32 PM"
        }, {
            username: "anonybro@123",
            text: "Hello guys",
            timeStamp: "21/5/2024, 7:27:33 pm"
        }, {
            username: "sundaram",
            text: "how are you doing yuvraj", 
            timeStamp: "21/5/2024, 7:27:33 pm"
        }, {
            username: "yuvraj69",
            text: "i am doing good", 
            timeStamp: "21/5/2024, 1:46:16 pm"
        }, {
            username: "sundaram",
            text: "me too", 
            timeStamp: "21/5/2024, 1:46:16 pm"
        }, {
            username: "anonybro@123",
            text: "hi guys", 
            timeStamp: "21/5/2024, 1:46:16 pm"
        }, {
            username: "sundaram",
            text: "hi bro", 
            timeStamp: "21/5/2024, 1:46:16 pm"
        }, {
            username: "anonybro@123",
            text: "finally", 
            timeStamp: "21/5/2024, 1:46:16 pm"
        }
    ]

    // create messages
    await Promise.all(
        messages.map(async (message) => {
            return await prisma.message.create({
                data: message
            })
        })
    )
}


main()
    .then(async () => {
        console.log("Seed data inserted successfully")
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("Error inserting seed data:", e)
        await prisma.$disconnect()
        process.exit(1)
    })