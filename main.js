import express from 'express';
import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import swaggerJsDoc from 'swagger-jsdoc';      
import swaggerUi from 'swagger-ui-express';

program
  .requiredOption('-h, --host <string>', 'server host')
  .requiredOption('-p, --port <number>', 'server port', parseInt)
  .requiredOption('-c, --cache <string>', 'cache path');

program.parse(process.argv);
const { host, port, cache } = program.opts();

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', 
        info: {
            title: "Apishka",
            description: "lab work",
            servers: [`http://${host}:${port}`]
        }
    },
    apis: ['docs.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.resolve('.'))); 

const storage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    try { await fs.access(cache); } 
    catch { await fs.mkdir(cache, { recursive: true }); }
    callback(null, cache);
  },
  filename: (_req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

let inventory = []; 
const Inventory_File = path.resolve('inventory.json'); 

async function saveItems() {
    try {
        await fs.writeFile(Inventory_File, JSON.stringify(inventory, null, 2));
        console.log('Data saved in inventory.json');
    } catch (err) {
        console.error('Error saving data in inventory.json', err);
    }
}

app.get('/RegisterForm.html', (_req, res) => res.sendFile(path.resolve('RegisterForm.html')));
app.get('/SearchForm.html', (_req, res) => res.sendFile(path.resolve('SearchForm.html')));

app.post('/register', upload.single('photo'), async (req, res) => {
    const { inventory_name, description } = req.body;
    
    if (!inventory_name) {
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
                console.log('File deleted due to missing inventory_name');
            } catch (err) { console.error('Error deleting file', err); }
        }
        return res.status(400).send('Bad Request: inventory_name is required');
    }

    const newItem = {
        id: Date.now().toString(),
        name: inventory_name,
        description: description || '',
        photo: req.file ? req.file.filename : null
    };
    
    inventory.push(newItem);
    await saveItems(); 

    res.status(201).sendFile(path.resolve('Succses.html'));
});

app.all('/register', (req, res) => res.status(405).send('Method not allowed'));

app.get('/search', (req, res) => {
    const { id, includePhoto } = req.query; 

    const item = inventory.find(i => i.id === id);
    if (!item) return res.status(404).send('Not Found');

    const resultItem = { ...item };

    if (includePhoto === 'on' && resultItem.photo) {
        const photoLink = `http://${host}:${port}/inventory/${item.id}/photo`;
        resultItem.description += ` Photo: ${photoLink}`;
    }

    res.status(200).json(resultItem);
});

app.all('/search', (req, res) => res.status(405).send('Method not allowed'));

app.get('/inventory', (_req, res) => {
    const result = inventory.map(item => ({
        ...item,
        photoUrl: item.photo ? `http://${host}:${port}/inventory/${item.id}/photo` : null
    }));
    res.status(200).json(result);
});

app.all('/inventory', (req, res) => res.status(405).send('Method not allowed'));

app.get('/inventory/:id', (req, res) => {
    const item = inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).send('Not found');
    res.status(200).json(item);
});


app.put('/inventory/:id', async (req, res) => {
    const item = inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).send('Not found');
    
    const { name, description } = req.body;
    if (name) item.name = name;
    if (description) item.description = description;
    
    await saveItems(); 
    res.status(200).send('Updated');
});


app.get('/inventory/:id/photo', (req, res) => {
    const item = inventory.find(i => i.id === req.params.id);
    if (!item || !item.photo) return res.status(404).send('Not found');
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.resolve(cache, item.photo));
});

app.put('/inventory/:id/photo', upload.single('photo'), async (req, res) => {
    const item = inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).send('Not found');

    if (req.file) {
        if (item.photo) {
            try { await fs.unlink(path.join(cache, item.photo)); } catch(err){}
        }

        item.photo = req.file.filename;
        await saveItems(); 
        res.status(200).send('Photo updated');
    } else {
        res.status(400).send('No file uploaded');
    }
});

app.all('/inventory/:id/photo', (req, res) => res.status(405).send('Method not allowed'));

app.delete('/inventory/:id', async (req, res) => {
    const index = inventory.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).send('Not found');
    
    const item = inventory[index];
    if (item.photo) {
        try { await fs.unlink(path.join(cache, item.photo)); } catch (err) {}
    }

    inventory.splice(index, 1);
    
    await saveItems(); 
    res.status(200).send('Deleted');
});

app.all('/inventory/:id', (_req, res) => res.status(405).send('Method not allowed'));


async function start() {
    try { await fs.access(cache); } 
    catch { await fs.mkdir(cache, { recursive: true }); }

    try {
        const data = await fs.readFile(Inventory_File, 'utf-8');
        inventory = JSON.parse(data);
        console.log(`The inventory file has ${inventory.length} items.`);
    } catch (err) {
        console.log('The inventory file is empty. Starting fresh.');
        inventory = [];
    }

    app.listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}`);
    });
}

start();