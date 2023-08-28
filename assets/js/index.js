// Fetch Variables
const moviesUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// Response Variables
let movieData;

// SVG Dimensions Variables
let width = 1000, height = 600;

// Store the SVG Element
const svg = d3.select("#svg");
// Store the Tooltip
const tooltip = d3.select("#tooltip");

// Function to add the width and height to the svg
function drawSvg() {
    svg.attr('width', width)
        .attr('height', height);
}

const drawTreeMap = () => {
    const hierarchy = d3
        .hierarchy(movieData, (node) => {
            return node["children"];
        })
        .sum((node) => {
            return node["value"];
        })
        .sort((node1, node2) => {
            return node2["value"] - node1["value"];
        });

    const createTreeMap = d3.treemap().size([1000, 600]);

    createTreeMap(hierarchy);

    const movieTiles = hierarchy.leaves();

    const block = svg
        .selectAll("g")
        .data(movieTiles)
        .enter()
        .append("g")
        .attr("transform", (movie) => {
            return "translate(" + movie["x0"] + ", " + movie["y0"] + ")";
        });

    block
        .append("rect")
        .attr("class", "tile")
        .attr("fill", (movie) => {
            const category = movie["data"]["category"];
            /* #310055 */
            if (category === "Action") {
                return "#3c0663";
            } else if (category === "Drama") {
                return "#4a0a77";
            } else if (category === "Adventure") {
                return "#5a108f";
            } else if (category === "Family") {
                return "#6818a5";
            } else if (category === "Animation") {
                return "#8b2fc9";
            } else if (category === "Comedy") {
                return "#ab51e3";
            } else if (category === "Biography") {
                return "#bd68ee";
            }
        })
        .attr("data-name", (movie) => {
            return movie["data"]["name"];
        })
        .attr("data-category", (movie) => {
            return movie["data"]["category"];
        })
        .attr("data-value", (movie) => {
            return movie["data"]["value"];
        })
        .attr("width", (movie) => {
            return movie["x1"] - movie["x0"];
        })
        .attr("height", (movie) => {
            return movie["y1"] - movie["y0"];
        })
        .on("mouseover", (movie) => {
            tooltip.transition().style("visibility", "visible");

            const revenue = movie["data"]["value"]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            tooltip.html("$ " + revenue + "<br />" + movie["data"]["name"]);

            tooltip.attr("data-value", movie["data"]["value"]);
        })
        .on("mouseout", (movie) => {
            tooltip.transition().style("visibility", "hidden");
        });

    block
        .append("text")
        .text((movie) => {
            return movie["data"]["name"];
        })
        .attr("x", 5)
        .attr("y", 20)
        .attr("fill", '#e7e7e7');
};

// Make the request to the url
d3.json(moviesUrl).then((MoviesData, error) => {
    if (error) {
        throw error;
    } else {
        movieData = MoviesData;

        console.log(movieData)
        drawSvg();
        drawTreeMap();
    }
});