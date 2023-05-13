
window.onload = () => {
    const url = new URL(location.href)
    const param = new URLSearchParams(url.search)
    console.log(param.get('a'))
    // drawText(param.get('a'))
    drawText()
}

async function drawText() {
    const canvas = document.getElementById('canvas')
    const canvasImage = new CanvasImage(canvas)

    const backgroundUrl = 'https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg'
    const url = "https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg"

    // const backgroundUrl = 'https://placehold.jp/400x500.png'
    canvasImage.drawBackground(backgroundUrl, 0, 0)
    await new Promise(r => setTimeout(r, 100))


    canvasImage.drawOpacityWhiteRect()
    canvasImage.drawTitle('⛺9すめテント3選', 60)

    let x = 220
    let y = 90
    let spacing = 200

    const headline = "奈良金魚ミュージアム"
    const msg = "日本三大金魚の産地のひとつ、奈良県に日本最大級の金魚ミュージアムが誕生。全体が“金魚”をコンセプトとしており、今を駆け抜けるアーティスト達によって表現されています"
    // const url = 'https://placehold.jp/400x500.png'
    canvasImage.drawContent(headline, msg, url, x, y)
    y += spacing
    canvasImage.drawContent(headline, msg, url, x, y)
    y += spacing
    canvasImage.drawContent(headline, msg, url, x, y)


    // console.log(canvas.toDataURL('image/png'))



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
    }

    /**
     * 見出しの文言を作成する 
     * @param string text 見出しの文字
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawHeadline(text, x, y) {
        const leftMargin = 30
        this._ctx.beginPath()
        this._ctx.fillStyle = '#666'
        this._ctx.font = `bold ${this._fontSize + 10}px 'Yusei Magic', 'sans-serif'`;
        this._ctx.textBaseline = 'middle'
        this._ctx.textAlign = 'start'
        this._ctx.fillText(
            text,
            x + this._rectWidth + leftMargin,
            y + this._rectHeight / 2,
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

        const centerX = x + this._rectWidth / 2
        const centerY = y + this._rectHeight / 2
        // 黒い四角を作る
        this._ctx.beginPath()
        this._ctx.fillStyle = '#ffaa00'
        // this._ctx.fillRect(x, y, this._rectWidth, this._rectHeight)
        this._ctx.arc(centerX, centerY, this._rectWidth, 0, 2 * Math.PI, false);
        this._ctx.fill();

        // x,y座標から正方形の中央にテキストを配置する
        this._ctx.beginPath()
        this._ctx.fillStyle = '#fff'
        this._ctx.font = `bold ${this._fontSize}px 'sans-serif'`;
        this._ctx.textBaseline = 'middle'
        this._ctx.textAlign = 'center'
        this._ctx.fillText(
            number,
            centerX,
            centerY
        )
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
        const leftMargin = 30
        x = x + leftMargin * 2
        const MaxWidth = 250
        const lineHeight = this._fontSize + 5
        const textArr = text.split("");
        let line = ''
        this._ctx.beginPath()
        for (let i = 0; i < textArr.length; i++) {
            let oneline = line + textArr[i]
            console.log(oneline)
            //文字の長さを計測するときのfontのサイズが異なってしまうため、ここでリセットする
            this._ctx.font = `${this._fontSize}px 'Yusei Magic', 'sans-serif'`;

            // 文字の長さを取得する
            let metrics = this._ctx.measureText(oneline)
            let textWidth = metrics.width
            // console.log(textWidth)
            console.log(textWidth)

            if (textWidth > MaxWidth) {
                //  超過した場合は、文字を描写
                this._ctx.beginPath()
                this._ctx.fillStyle = '#666'
                this._ctx.textAlign = 'start'
                this._ctx.fillText(oneline, x, y)
                y += lineHeight
                line = ''
                console.log(line)
                console.log(textWidth)
            } else {
                console.log('文字を加えていく')
                console.log(textWidth)
                console.log(line)
                line = oneline
                if (i == textArr.length - 1) {
                    console.log('最後の文字の場合は描写')
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
        this._ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        this._ctx.roundRect(padding, padding, width - 2 * padding, height - 2 * padding, round)
        this._ctx.fill()
    }

    /**
     * URLからテキストを描写する
     * @param string headline タイトル
     * @param string message 説明文
     * @param string url 画像URL
     * @param int x x座標
     * @param int y y座標
     * 
     */
    drawContent(
        headline,
        message,
        url,
        x,
        y
    ) {
        this.drawTime("15:30", x, y)
        this.drawHeadline(headline, x, y)
        this.drawTextArea(message, x, y + 60)
        // this.drawImgFromURL(url, x - 150, y)
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

}