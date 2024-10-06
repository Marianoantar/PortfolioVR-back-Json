// 'use strict';
// const express = require('express');
// const app = express();
// const { default: mongoose } = require('mongoose');
// const ProjectModel = require('../models/project');
const fs = require('fs').promises;
const path = require('path');
const { strict } = require('assert');
// const { path } = require('path');


// const multer = require('multer');
// const upload = multer({ dest: './uploads' });


const controller = {};

// Ruta al archivo JSON
const projectsFilePath = path.join(__dirname, '../data/projects.json');
// const imagePath = path.join(__dirname, '..', 'uploads');


// Cargar Proyectos
async function cargarProjects() {
    const data = await fs.readFile(projectsFilePath, 'utf8');
    if(!data) {
        res.status(500).json({message: error.message});
    }
    const projects = JSON.parse(data);
    return projects;
}

const projects = cargarProjects();


function createId(texto) {
    let suma = 0;
    for (let i = 0; i < texto.length; i++) {
        suma += texto.charCodeAt(i);
    }
    const randomNumber = Math.random() * 100;
    return suma * randomNumber
}

controller.home = (req, res) => {
    return res.status(200).send({message: 'Soy la Funcion home'})
};

controller.test = (req, res) => {
    return res.status(200).send({message: 'Soy la Funcion test'})
}

controller.getProjects = async function (req, res) {
    try {
        // const allProjects = await ProjectModel.find().sort('year');
        const data = await fs.readFile(projectsFilePath, 'utf8');
        const allProjects = JSON.parse(data);
        res.status(200).json( allProjects );
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

controller.saveProject = async (req, res) => {
    try {
        const project = req.body;
        
        // Agregar un ID aleatorio
        let texto = project.name;
        let suma = 0;
        for (let i = 0; i < texto.length; i++) {
            suma += texto.charCodeAt(i);
        }
        const randomNumber = Math.random() * 100;
        const id = Math.trunc(suma * randomNumber);
        // const id = this.createId(project.name);

        project.id = id;
        console.log(project);

        const data = await fs.readFile(projectsFilePath, 'utf8');
        const projects = JSON.parse(data);        

        // Verifica si existe nombre
        const exists = await projects.find(proj => proj.name === project.name);
        if (exists) {
            res.status(400).json({message: 'El proyecto ya existe'});
            return;
        }
        
        // agregar el proyectto 
        projects.push(project);
        // Convertir arreglo a cadena Json
        const jsonProjects = JSON.stringify(projects, null, 2);
        // Guardar en el archivo JSON
        fs.writeFile(projectsFilePath, jsonProjects, 'utf8');
        res.status(201).json(project);
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

controller.getProject = async (req, res) => {
    try {
        let { id } = req.params;
        id = parseInt(id, 10);

        // cargar proyectos
        const data = await fs.readFile(projectsFilePath, 'utf8');
        const projects = JSON.parse(data);   


        // Verificar si existe id y resuelve
        const project = await projects.find(proj => proj.id === id);
        // const project = await ProjectModel.findById(id);

        if(project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({message: 'El proyecto no existe'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

controller.getProjectByName = async (req, res) => {
  try {
    const { name } = req.params;
    console.log('nombre buscado: ', name);

    // cargar proyectos
    const data = await fs.readFile(projectsFilePath, 'utf8');
    const projects = JSON.parse(data);  

    // const  objeto_id =  await ProjectModel.find({ name }, { limit: 1 });
    // const objeto_id = await projects.find(proj => proj.name === name);
    // if (objeto_id.length > 0) {
        //     const id = objeto_id[0]._id;
        //     const project = await ProjectModel.findById(id);
        
    const indice = projects.findIndex(proj => proj.name === name);
    if (indice >= 0) {
        const project = projects[indice];
        res.status(200).json(project);
    } else {
        res.status(404).json({ message: "El proyecto no existe" });
    }
  } catch (error) {
    res.status(500).json({ message: 'catch' + error.message });
  }
};

controller.updateProject = async (req, res) => {
    try {
        let { id } = req.params;
        id = parseInt(id, 10);
        console.log('El id a guardar es:',id);

          // cargar proyectos
        const data = await fs.readFile(projectsFilePath, 'utf8');
        const projects = JSON.parse(data);  

        const project = req.body;
        console.log('El proyecto a guardar es: ', project);

        // verificar si es valido ID
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     res.status(404).json({message: 'ID inválido'});
        //     return};
            
        // Verificar si existe id y resuelve
        console.log('los proyectos son: ',projects );
        const indice = projects.findIndex(proj => proj.id === id);
        console.log('indice a actualizar: ',indice);
        if (indice >= 0) {
            // await ProjectModel.findByIdAndUpdate(id, project);
            projects[indice] = project;
            // Convertir arreglo a cadena Json
            const jsonProjects = JSON.stringify(projects, null, 2);
            // Guardar en el archivo JSON
            fs.writeFile(projectsFilePath, jsonProjects, 'utf8');
            res.status(200).json(project);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

controller.deleteProject = async (req, res) => {
    try {
        let { id } = req.params;
        console.log('id que llegó: ', id);
        id = parseInt(id, 10);
        console.log('id buscado: ', id);
      
        // cargar proyectos
        const data = await fs.readFile(projectsFilePath, 'utf8');
        const projects = JSON.parse(data);  
        // console.log('projects cargados: ', projects);
        // Verificar si existe id y resuelve
        const indice =  projects.findIndex(proj => proj.id === id);
        console.log('indice a borrar: ',indice);

        if (indice !== -1) {
            // await ProjectModel.findByIdAndDelete(id);
            // Borrar proyecto
            projects.splice(indice, 1);
            // Convertir arreglo a cadena Json
            const jsonProjects = JSON.stringify(projects, null, 2);
            // Guardar en el archivo JSON
            fs.writeFile(projectsFilePath, jsonProjects, 'utf8');
            
            // Eliminar imagen
            if (req.file) {
                fs.unlink(req.file.path, (error) => {
                    if (error) {
                        console.error('Error al eliminar archivo:', error);
                    }
                });
            }

            
            // Responder con mensaje de borrado correcto
            res.status(200).json({message: 'El Proyecto ha sido borrado'})
        } else {
            res.status(404).json({message: error.message})        
        }
    } catch (error) {
        res.status(404).json({message: error.message})        
    }

};

controller.uploadImage = async (req, res) => {
    try {
        let { id } = req.params;
        id = parseInt(id, 10);

        if (req.file) {
            // 1. Comprobar tipo de archivo
            const allowedTypes = ['image'];
            if (!allowedTypes.includes(req.file.mimetype.split('/')[0])) {
                fs.unlink(req.file.path, (error) => {
                if (error) {
                    console.error('Error al eliminar archivo no válido:', error);
                    return res.status(500).json({ message: 'Error interno del servidor' }); // Mensaje genérico para el usuario
                }
                });
                return res.status(400).json({ message: 'El archivo no es una imagen, será eliminado' });
            }
            
            // 2. Comprobar extensiones permitidas
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const extension = req.file.mimetype.split('/')[1];
            if (!allowedExtensions.includes(extension)) {
                fs.unlink(req.file.path, (error) => {
                if (error) {
                    console.error('Error al eliminar archivo no válido:', error);
                    return res.status(500).json({ message: 'Error interno del servidor' });
                }
                });
                return res.status(400).json({ message: 'La extensión del archivo imagen tiene que ser jpg, jpeg, png o gif' });
            }

            // cargar proyectos
            const data = await fs.readFile(projectsFilePath, 'utf8');
            const projects = JSON.parse(data);  
            
            // Continuar con la lógica de carga de archivo
            const fileName = req.file.filename;
            console.log('Nombre Archivo a subir: ',fileName);
            // await ProjectModel.findByIdAndUpdate(id, {image: fileName});
            const indice = projects.findIndex(proj => proj.id === id);
            console.log('Indice de Proyecto a subir Imagen: ',indice);

            if (indice !== -1){
                projects[indice].image = fileName;
                console.log('prooyecto al q se subio imagen: ',projects[indice]);
                // Convertir arreglo a cadena Json
                const jsonProjects = JSON.stringify(projects, null, 2);
                // Guardar en el archivo JSON
                fs.writeFile(projectsFilePath, jsonProjects, 'utf8');

                // Eliminar imagen anterior
                // if (projects[indice].image!== 'default.jpg') {
                //     fs.unlink(path.resolve(`./uploads/${projects[indice].image}`), (error) => {
                //         if (error) {
                //             console.error('Error al eliminar archivo anterior:', error);
                //         }
                //     });
                // }

                
                // // Responder con el nombre del archivo subido
                // res.status(200).json({ image: fileName });

            }


            res.status(200).json({ image: fileName });
            } else {
            // Manejar caso en que no se haya subido ningún archivo
            return res.status(400).json({ message: 'No se ha seleccionado ningún archivo' });
            }
    } catch (error) {
        res.status(501).json({message: error.message});
    }
};

controller.getImageFile = async (req, res) => {
    // const file = req.params.image;
    // console.log(file);
    // const path_file = '../uploads/' + file;
    // console.log(path_file);
    // try {
    //     // !!!!!!!!!!!!!!!!!!!!!!!
    //     if (fs.existsSync(path_file)) {
    //         return res.sendFile(path.resolve(path_file));
    //     } else {
    //         return res.status(200).send({message: 'El archivo no existe...'});
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({message: 'error al recuperar imagen'});
    // }
    const file = req.params.image;

    // Validación básica del nombre del archivo
    // if (!file || !/^[a-zA-Z0-9_\-]+$/.test(file)) {
    //     return res.status(400).json({ message: 'Nombre de archivo inválido' });
    // }
    let imagePath = path.join(__dirname, '..', 'uploads', file);

    console.log('path de la imagen: ', imagePath);
    console.log('file: ', file);
    // imagePath = path.join(this.imagePath, file);

    try {
        await fs.access(imagePath, fs.constants.R_OK);
        return res.sendFile(imagePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        } else {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener el archivo' });
        }
    }
 
}


module.exports = controller;