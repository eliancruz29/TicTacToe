
var HelloWorldLayer = cc.Layer.extend({
    tablero:null,
    positionX:115,
    positionY:180,
    player:undefined,
    positionTablero: [],
    sizeTablero:3,
    widthBlock:85,
    heightBlock:99,
    sizeLine:10,
    X:null,
    O:null,
    
    
    showWinner: function(position){
        alert("Winner is: "+position.player);
        this.player = undefined;
        for(var i=0; i<this.sizeTablero; i++){
            for(var j=0; j<this.sizeTablero; j++){
                this.positionTablero[i][j].filled = false;
                this.positionTablero[i][j].player = undefined;
                this.removeChildByTag(((3*i)+(j+1)), true);
            }
        }
    },
    
    
    evalueWinner: function(position){
        //console.log(position);
        for(var i=0; i<this.sizeTablero; i++){
            //console.log(this.positionTablero[i][position.j-1]);
            if(this.positionTablero[i][position.j-1].player === undefined || 
               this.positionTablero[i][position.j-1].player !== position.player){
                break;
            }
            if(i === (this.sizeTablero-1)){
                this.showWinner(position);
            }
        }
        for(var j=0; j<this.sizeTablero; j++){
            //console.log(this.positionTablero[position.i-1][i]);
            if(this.positionTablero[position.i-1][j].player === undefined || 
               this.positionTablero[position.i-1][j].player !== position.player){
                break;
            }
            if(j === (this.sizeTablero-1)){
                this.showWinner(position);
            }
        }
        if((position.i+position.j!==4) && ((position.i%2===0) || (position.j%2===0))){
            return;
        }else{
            if(position.j!==2 || position.i!==2){
                if(this.positionTablero[1][1].player===undefined || position.player!==this.positionTablero[1][1].player)
                    return;
                else if(this.positionTablero[3-position.i][3-position.j].player!==position.player)
                    return;
                else
                    this.showWinner(position);
            }else{
                if(this.positionTablero[0][0].player!==undefined && this.positionTablero[0][0].player===position.player){
                    if(this.positionTablero[2][2].player!==undefined && this.positionTablero[2][2].player===position.player)
                        this.showWinner(position);
                    else
                        return;
                }else if(this.positionTablero[0][2].player!==undefined && this.positionTablero[0][2].player===position.player){
                    if(this.positionTablero[2][0].player!==undefined && this.positionTablero[2][0].player===position.player)
                        this.showWinner(position);
                    else
                        return;
                }
            }
        }
    },
               
    
    createIcon: function(position){
        //console.log(position);
        if(!position.filled){
            var icon = undefined;
            if(this.player === "X"){
                icon = new cc.Sprite(res.X_png);
                position.player = "X";
                this.player = "O";
            }else{
                icon = new cc.Sprite(res.O_png);
                position.player = "O";
                this.player = "X";
            }
            icon.setPosition(position.x, position.y);
            icon.setTag((3*(position.i-1))+position.j);
            position.filled = true;
            this.addChild(icon, 1);
        }
    },
    
    
    setIcon: function(ubicacion, event, ejecutar){
        //console.log("Icon was setted ;)");
        var juego = event.getCurrentTarget();
        var cuadroTablero = juego.tablero.getBoundingBox();
        if(cc.rectContainsPoint(cuadroTablero, ubicacion)){
            //console.log("Estamos dentro :)");
            for(var position of juego.positionTablero){
                for(var _position of position){
                    //console.log(_position);                    
                    if((Math.abs(ubicacion.x-_position.x)<=(juego.widthBlock/2)) 
                       && (Math.abs(ubicacion.y-_position.y)<=(juego.heightBlock/2))){
                        //console.log("Esta adentro ;)");
                        juego.createIcon(_position);
                        juego.evalueWinner(_position);
                        ejecutar();
                    }
                }
            }
        }
    },
    
    
    firstMove: function(location, event){
        var ubicacion = location.getLocation();
		var juego = event.getCurrentTarget();
        var spriteX = juego.X.getBoundingBox();
        var spriteO = juego.O.getBoundingBox();
        if(cc.rectContainsPoint(spriteX,ubicacion)){
            juego.player = "X";
            alert("Usted es el jugador: X");
        }else if(cc.rectContainsPoint(spriteO,ubicacion)){
            juego.player = "O";
            alert("Usted es el jugador: O");
        }else if(juego.player !== undefined){
            juego.setIcon(ubicacion, event, function(){return false;});
        }else{
            alert("Debe seleccionar un Icono");
            return false;
        }
    },
    
    
    ctor:function () {
        this._super();
        var size = cc.winSize;
        //Adding the sprite for "Tablero"
        this.tablero = new cc.Sprite(res.tablero_png);
        this.tablero.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.tablero, 0);
        var tableroCenterX = this.tablero.getPositionX();
        var tableroCenterY = this.tablero.getPositionY();
        //Adding the sprite for X icon
        this.X = new cc.Sprite(res.X_png);
        this.X.setPosition(tableroCenterX-this.positionX, tableroCenterY+this.positionY);
        this.addChild(this.X, 0);
        //Adding the sprite for O icon
        this.O = new cc.Sprite(res.O_png);
        this.O.setPosition(tableroCenterX-this.positionX+this.X.width-(this.X.width*0.1), 
                      tableroCenterY+this.positionY);
        this.addChild(this.O, 0);
        
        for(var i=1; i<=this.sizeTablero; i++){
            this.positionTablero.push(new Array(this.sizeTablero));
            for(var j=1; j<=this.sizeTablero; j++){
                this.positionTablero[i-1][j-1] = {
                    x:(tableroCenterX-(this.tablero.width/2)+23+((j-1)*(this.widthBlock+this.sizeLine))+(this.widthBlock/2)),
                    y:(tableroCenterY-(this.tablero.height/2)+23+((i-1)*(this.heightBlock+this.sizeLine))+(this.heightBlock/2)),
                    i:i, j:j, filled:false, player:undefined
                };
            }
        }
        
        //Agregando eventos
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this.firstMove
		}, this);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});