const { PrismaClient } = require("@prisma/client");
const faker = require('faker');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();



const CreateUser = async (role) => {
    let user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role,
    };
    try {
        await prisma.user.create({
            data: {
                nom: user.name,
                email: user.email,
                password: bcrypt.hashSync(user.password, 10),
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
    }
    return user;
}

const CreateUsers = async (number, role) => {
    const users = [];
    for (let i = 0; i < number; i++) {
        users.push(await CreateUser(role));
    }
    return users;
}

const CreateCategory = async () => {
    let category = {
        nom: faker.commerce.department(),
    }
    return category;
}

const CreateCategories = async (number) => {
    let categories = [];
    while (categories.length != number) {
        let category = await CreateCategory()
        if (categories.filter(e => e.nom == category.nom).length == 0) {
            categories.push(category);
        }
    }
    for (const category of categories) {
        await prisma.category.create({
            data: {
                nom: category.nom,
            }
        })
    }
}

const CreateArticle = async () => {
    await prisma.article.create({
        data: {
            titre: faker.lorem.sentence(),
            contenu: faker.lorem.paragraph(),
            published: true,
            auteur: {
                connect: {
                    id: faker.datatype.number({ min: 1, max: 10 }),
                },
            },
            Category: {
                connect: {
                    id: Number(faker.datatype.number({ min: 1, max: 10 }))
                },
            },
        },
    });
}

const CreateArticles = async (number) => {
    for (let i = 0; i < number; i++) {
        await CreateArticle();
    }
}


(async () => {
    let ADMIN = await CreateUser('ADMIN');
    console.log(ADMIN);
    let users = await CreateUsers(10, 'AUTHOR');
    console.log(users);
    await CreateCategories(10);
    await CreateArticles(100);
})();