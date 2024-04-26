const productosSchema = {
    name: 'producto',
    title: 'Producto',
    type: 'document',
    fields: [
        {
            name: 'nombre',
            title: 'Nombre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'nombre',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        { name: 'categoria',
         title: 'Categoría',
          type: 'reference',
           to: [{ type: 'categoria' }], validation: (Rule) => Rule.required(), },
            { name: 'nuevaCategoria', title: 'Nueva Categoría', type: 'string', },

        {
            name: 'descripcion',
            title: 'Descripción',
            type: 'text',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'precio',
            title: 'Precio',
            type: 'number',
            validation: (Rule) => Rule.required().positive(),
        },
        {
            name: 'imagenes',
            title: 'Imágenes',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            validation: (Rule) => Rule.required(),
        },
        // Agrega aquí más campos según tus necesidades
    ],
};


export default productosSchema;