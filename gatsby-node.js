const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const {
    data: {
      recipe: { nodes, totalCount },
    },
  } = await graphql(`
    query {
      recipe: allContentfulRecipe {
        totalCount
        nodes {
          name
          content {
            tags
          }
        }
      }
    }
  `)

  createPage({
    path: `/about`,
    component: path.resolve(`src/templates/about/index.jsx`),
    context: {
      page: "about",
    },
  })
  createPage({
    path: `/contact`,
    component: path.resolve(`src/templates/contact/index.jsx`),
    context: {
      page: "contact",
    },
  })
  createPage({
    path: `/recipes`,
    component: path.resolve(`src/templates/recipes/index.jsx`),
    context: {
      page: "recipes",
    },
  })
  createPage({
    path: `/`,
    component: path.resolve(`src/templates/home/index.jsx`),
    context: {
      page: "home",
    },
  })

  let recipeTags = {}

  nodes.forEach(parent => {
    parent.content.tags.forEach(tag => {
      if (Object.keys(recipeTags).includes(tag)) {
        recipeTags[tag] = recipeTags[tag] + 1
      } else {
        recipeTags[tag] = 1
      }
    })
  })

  Object.keys(recipeTags).forEach(tag => {
    const title = tag.toLowerCase().replace(/ /g, "-")
    createPage({
      path: `/tags/${title}`,
      component: path.resolve(`src/templates/tags/index.jsx`),
      context: {
        tag,
      },
    })
  })

  Array.from(Array(totalCount / 7).keys()).forEach((count, i, array) => {
    createPage({
      path: `/recipes/${count + 1}`,
      component: path.resolve(`src/templates/recipes/index.jsx`),
      context: {
        skip: 7 * count,
        limit: 7,
        pages: array,
        tags: recipeTags,
      },
    })
  })

  nodes.forEach(({ name }) => {
    const title = name.toLowerCase().replace(/ /g, "-")

    createPage({
      path: `/${title}`,
      component: path.resolve(`src/templates/recipe/index.jsx`),
      context: {
        name,
      },
    })
  })
}