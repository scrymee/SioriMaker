
window.onload = () => {

    displayInputFromParams()

    init()
}

function displayInputFromParams() {
    const url = new URL(location.href)
    const params = new URLSearchParams(url.search)

    console.log(params.size)
    if (params.size > 1) {
        //1回はすでにあるため1引く
        for (let i = 0; i < params.size - 1; i++) {
            education_fields()
        }
    }
    for (let param of params) {
        const id = param[0]
        const contents = param[1]
        if (param[1] === undefined) continue
        const formattedContent = contents.split(',')
        const content = document.getElementById(id)
        content.querySelector('.time').value = formattedContent[0]
        content.querySelector('.headline').value = formattedContent[1]
        content.querySelector('.text').value = formattedContent[2]
    }
}

function update() {
    const submit = document.getElementById('submit')
    submit.addEventListener('click', async () => {

        //contentsを取得
        const contents = document.getElementsByClassName('contentlist')
        //canvasに初期描写
        const canvas = new CanvasImage(document.getElementById('canvas'))
        canvas.drawInit()
        await new Promise(r => setTimeout(r, 100))

        const href = window.location.href
        //クエリパラメータを取り除く
        const url = new URL(href.replace(location.search, ''))


        // テキストを描写
        for (let i = 0; i < contents.length; i++) {
            const content = contents[i]
            canvas.drawFromCanvasInput(content)
            const time = content.querySelector('.time').value
            const headline = content.querySelector('.headline').value
            const text = content.querySelector('.text').value
            //クエリパラメータに設定
            url.searchParams.set(content.id, `${time},${headline},${text}`)
        }
        // url.searchParams.set('content2', content.value)
        window.location.href = url
        console.log(url)
    })
}

async function init() {

    //初期描写
    const canvas = new CanvasImage(document.getElementById('canvas'))
    canvas.drawInit()
    await new Promise(r => setTimeout(r, 100))

    //ループ
    //contentsを取得
    const contents = document.getElementsByClassName('contentlist')
    for (let i = 0; i < contents.length; i++) {
        const content = contents[i]
        canvas.drawFromCanvasInput(content)
    }
    update()

}

class CanvasImage {
    constructor(canvas) {
        //キャンバスの要素を定義
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');
        //セッティング

        this._fontSize = 15
        // 吹き出しのスクエアサイズ
        this._rectWidth = 30
        this._rectHeight = 30


        //コンテンツの数
        this._contentCount = 0
        this._contentHeight = 200
        this._contentStartY = 120
        this._contentX = 70
        // this._contentX = 300
        this._leftMargin = 30
        this._MaxWidth = 400
        // this._MaxWidth = 200


    }

    /**
     * 初期描写を行う
     */
    async drawInit() {
        const backgroundUrl = 'https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg'

        this.drawBackground(backgroundUrl, 0, 0)
        await new Promise(r => setTimeout(r, 100))


        this.drawOpacityWhiteRect()
        this.drawTitle('京都旅行のしおり', 60)


        this.drawAlignLine()

    }

    /**
     * 見出しの文言を作成する 
     * @param string text 見出しの文字
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawHeadline(text, x, y) {
        this._ctx.beginPath()
        this._ctx.fillStyle = '#666'
        this._ctx.font = `bold ${this._fontSize + 7}px 'Yusei Magic', 'sans-serif'`;
        this._ctx.textBaseline = 'middle'
        this._ctx.textAlign = 'start'
        this._ctx.fillText(
            text,
            x + this._rectWidth + this._leftMargin,
            y,
        )
    }


    /**
     *  時刻を表示する
     * @param string number 数字
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawTime(number, x, y) {

        const leftTopX = x - this._rectWidth / 2
        const leftTopY = y - this._rectHeight / 2
        // 黒い四角を作る
        this._ctx.beginPath()
        this._ctx.fillStyle = '#ffaa00'
        // this._ctx.fillRect(x, y, this._rectWidth, this._rectHeight)
        this._ctx.arc(x, y, this._rectWidth, 0, 2 * Math.PI, false);
        this._ctx.fill();

        // x,y座標から正方形の中央にテキストを配置する
        this._ctx.beginPath()
        this._ctx.fillStyle = '#fff'
        this._ctx.font = `bold ${this._fontSize}px 'sans-serif'`;
        this._ctx.textBaseline = 'middle'
        this._ctx.textAlign = 'center'
        this._ctx.fillText(
            number,
            x,
            y
        )
    }

    /**
     *  移動を表示する
     * @param string number 数字
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawMoving(icon, x, y) {

        const leftTopX = x - this._rectWidth / 2
        const leftTopY = y - this._rectHeight / 2
        this._ctx.beginPath()
        this._ctx.fillStyle = '#ffaa00'
        this._ctx.arc(x, y, this._rectWidth / 1.5, 0, 2 * Math.PI, false);
        this._ctx.fill();

        // x,y座標から正方形の中央にテキストを配置する
        this._ctx.beginPath()
        this._ctx.fillStyle = '#fff'
        this._ctx.font = `bold ${this._fontSize}px 'sans-serif'`;
        this._ctx.textBaseline = 'middle'
        this._ctx.textAlign = 'center'
        this._ctx.fillText(
            icon,
            x,
            y
        )
        this.drawHeadline('徒歩', x, y)
    }


    /**
     * タイムラインの縦線を描写する
     * @param int yStart y座標 開始位置
     * @param int yEnd y座標 終了位置
     * @param int x x座標
     * 
     */
    drawAlignLine(x = this._contentX, yStart = 90, yEnd = 700) {
        this._ctx.beginPath()
        this._ctx.moveTo(x, yStart)
        this._ctx.lineTo(x, yEnd)
        this._ctx.setLineDash([8, 8])
        this._ctx.lineWidth = 3
        this._ctx.strokeStyle = "#ffdd00"
        this._ctx.stroke()

    }

    /**
     * 説明文を記載する
     * maxWidthで指定されている長さ以上になった場合、自動改行される
     * @param string text 見出しの文字
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawTextArea(text, x, y) {
        // 位置の定義
        x = x + this._leftMargin * 2
        const lineHeight = this._fontSize + 5
        const textArr = text.split("");
        let line = ''
        // 描写
        this._ctx.beginPath()
        for (let i = 0; i < textArr.length; i++) {
            let oneline = line + textArr[i]
            //文字の長さを計測するときのfontのサイズが異なってしまうため、ここでリセットする
            this._ctx.font = `${this._fontSize}px 'Yusei Magic', 'sans-serif'`;

            // 文字の長さを取得する
            let metrics = this._ctx.measureText(oneline)
            let textWidth = metrics.width

            if (textWidth > this._MaxWidth) {
                //  超過した場合は、文字を描写
                this._ctx.beginPath()
                this._ctx.fillStyle = '#666'
                this._ctx.textAlign = 'start'
                this._ctx.fillText(oneline, x, y)
                y += lineHeight
                line = ''
            } else {
                line = oneline
                if (i == textArr.length - 1) {
                    this._ctx.beginPath()
                    this._ctx.fillStyle = '#666'
                    this._ctx.textAlign = 'start'
                    this._ctx.fillText(line, x, y)

                }
            }
        }
    }

    /**
     * URLから画像を描写する
     * @param string url 画像URL
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawImgFromURL(url, x, y) {

        const img = new Image()
        img.src = url
        img.onload = () => {
            const imgW = 120
            const imgAspect = img.height / img.width
            console.log(imgW)
            this._ctx.beginPath()
            this._ctx.drawImage(img, x, y, imgW, imgW * imgAspect)
            this._ctx.strokeRect(x, y, imgW, imgW * imgAspect)
        }
    }

    /**
     * URLから画像を描写する
     * @param string url 画像URL
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawBackground(url) {
        const x = 0
        const y = 0
        const img = new Image()
        img.src = url
        img.onload = () => {

            //短い方に合わせる

            const Tatenaga = img.width < img.height
            if (Tatenaga) {
                const imgW = this._canvas.width
                const imgAspect = img.height / img.width
                this._ctx.beginPath()
                this._ctx.drawImage(img, x, y, imgW, imgW * imgAspect)
            } else {
                const imgH = this._canvas.height
                const imgAspect = img.width / img.height
                this._ctx.beginPath()
                this._ctx.drawImage(img, x, y, imgH * imgAspect, imgH)
            }
        }
    }

    /**
     * canvasのサイズに合わせて半透明の白背景を描く
     * 
     */
    drawOpacityWhiteRect() {
        const width = this._canvas.width
        const height = this._canvas.height
        const round = 10

        const padding = 20
        this._ctx.beginPath()
        this._ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
        this._ctx.roundRect(padding, padding, width - 2 * padding, height - 2 * padding, round)
        this._ctx.fill()
    }


    /**
     * タイトルを描写する
     * @param string text テキスト
     * @param int y y座標
     * 
     */
    drawTitle(text, y) {
        const title = '＼    ' + text + '    ／'
        this._ctx.beginPath()
        this._ctx.fillStyle = '#ffaa00'
        this._ctx.font = `${2.5 * this._fontSize}px 'Yusei Magic', 'sans-serif'`;


        let metrics = this._ctx.measureText(title)
        let textWidth = metrics.width
        this._ctx.fillText(title, canvas.width / 2 - textWidth / 2, y)
    }

    /**
     * URLからテキストを描写する
     * @param string time 時間
     * @param string headline タイトル
     * @param string message 説明文
     * @param string url 画像URL
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawContent(
        time,
        headline,
        message,
    ) {
        const x = this._contentX
        const y = this._contentStartY + this._contentHeight * this._contentCount
        this.drawTime(time, x, y)
        this.drawHeadline(headline, x, y)
        this.drawTextArea(message, x, y + 40)
        this._contentCount++
        // this.drawImgFromURL(url, x - 150, y)
    }

    drawFromCanvasInput(content) {

        const time = content.querySelector('.time').value
        const headline = content.querySelector('.headline').value
        const text = content.querySelector('.text').value
        this.drawContent(time, headline, text)
    }

}
