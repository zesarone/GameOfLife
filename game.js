(($) => {
    $(document).ready(() => {
        console.log('loaded')

        //Init
        var canvas = $('#board')
        
        var height = Math.floor(canvas.height() / 10)
        var width = Math.floor(canvas.width() / 10)
        canvas.attr('width', width*10)
        canvas.attr('height', height*10)
        var game = new world(width, height, canvas[0]);

        //create nodes
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                game.addNode(
                    new node(j, i)
                )
            }
        }
        // connect nodes
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (game.getNode(x - 1, y))
                    game.getNode(x, y).connect(game.getNode(x - 1, y))
                if (game.getNode(x + 1, y))
                    game.getNode(x, y).connect(game.getNode(x + 1, y))
                if (game.getNode(x, y - 1))
                    game.getNode(x, y).connect(game.getNode(x, y - 1))
                if (game.getNode(x, y - 1))
                    game.getNode(x, y).connect(game.getNode(x, y - 1))
                game.getNode(x, y).newAlive = Math.floor(Math.random() * 10000) % 2 === 1
            }
        }
        game.draw()
        game.start()

    })

    var world = function (w, h, c) {
        var out = {
            width: w,
            height: h,
            canvas: c,
            nodes: [],
        }
        out.getNode = (x, y) => out.nodes[y] ? (out.nodes[y][x] ? out.nodes[y][x] : false) : false
        out.addNode = (node) => {
            node.world = out
            if (!out.nodes[node.y])
                out.nodes[node.y] = []
            out.nodes[node.y][node.x] = node
        }
        out.draw = () => out.nodes.forEach((e) => e.forEach((el) => el.draw()))
        out.update = () => out.nodes.forEach((e) => e.forEach((el) => el.update()))
        out.tick = () => {
            out.update()
            out.draw()
        }
        out.start = () => window.setTimeout(()=> out.tick(), 200)
        return out
    }

    var node = function (x, y) {

        let out = {
            alive: false,
            newAlive: null,
            x: x,
            y: y,
            world: {},
            connections: [],
        }
        out.connect = (node) => {
            out.connections.push(node)
            return out
        }
        out.update = () => {
            var i = out.connections.length < 2 ? 0 :
                out.connections.reduce((r, e) => (e.alive) ? r+1 : r , 0)
            out.newAlive = out.alive ? !(i<2 || i >3):(i==3)
          
        }
        out.draw = () => {
            out.alive = out.newAlive
            var ctx = out.world.canvas.getContext("2d")
            ctx.beginPath()
            ctx.clearRect((out.x * 10), (out.y * 10), 10, 10)
            if(out.alive)
                ctx.arc((out.x * 10) + 5, (out.y * 10) + 5, 5 , 0, 2 * Math.PI)
            ctx.stroke()
            return out
        }

        return out
    }


})(jQuery)



