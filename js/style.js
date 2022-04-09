$(function () {
    var timer1, timer2, gData = 20
    // 板块内容显示与隐藏和panel的样式
    function showHide() {
        $('.panel1').on('click', () => {
            if($('.form_submit').css('display')==='block') {
                $('.panel1').css('backgroundColor','rgb(31,155,203)')
            }
            else {
                $('.panel1').css('backgroundColor','rgb(40,60,100)')
                console.log(1);
            }
            $('.form_submit').stop().slideToggle()
        })

        $('.panel2').on('click', () => {
            if($('.showbox').css('display')==='block') {
                $('.panel2').css('backgroundColor','rgb(31,155,203)')
            }
            else {
                $('.panel2').css('backgroundColor','rgb(40,60,100)')
                console.log(1);
            }
            $('.showbox').stop().slideToggle()
        })
        $('.panel3').on('click', () => {
            if($('.handle_record').css('display')==='block') {
                $('.panel3').css('backgroundColor','rgb(31,155,203)')
            }
            else {
                $('.panel3').css('backgroundColor','rgb(40,60,100)')
                console.log(1);
            }
            $('.handle_record').stop().slideToggle()
        })
        $('.panel4').on('click', () => {
            if($('.moni_box').css('display')==='block') {
                $('.panel4').css('backgroundColor','rgb(31,155,203)')
            }
            else {
                $('.panel4').css('backgroundColor','rgb(40,60,100)')
                console.log(1);
            }
            $('.moni_box').stop().slideToggle()
            $('.moni_con').stop().slideToggle()
        })
    }
    // 设置舵机转速
    function setSpeed() {
        $('.btn_con_moni').on('click', () => {
            if (isNaN($('.val_con_moni').val()) === true || $('.val_con_moni').val() <= 0 || $('.val_con_moni').val() > 360) {
                return alert('请输入有效数字!')
            }
            let val = 360 / $('.val_con_moni').val() + 's'
            $('.moni_box').css('animation', 'rotate ' + val + ' linear infinite')
        })
    }
    // 设置模拟模块下的input:text
    function moniVal() {
        $('.val_con_moni').on('click', () => {
            $('.val_con_moni').val('').css('color', '#000')
        })
        $('.btn_con_moni').on('click', () => {
            $('.val_con_moni').val('请设置转速°/s').css('color', '#555')
        })
    }
    // 补零函数
    function PadZero(n) {
        return n < 10 ? '0' + n : n
    }
    // 显示时间
    function showTime() {
        let data = new Date()
        let y = data.getFullYear()
        let m = data.getMonth() + 1
        let d = data.getDate()
        let hh = PadZero(data.getHours())
        let mm = PadZero(data.getMinutes())
        let ss = PadZero(data.getSeconds())
        $('.time').html(`${y}年${m}月${d}日 ${hh}:${mm}:${ss}`)
    }
    // 设置记录按钮样式
    function setClickBtn() {
        $('.note_btn').on('click', () => {
            $('.note_btn').css('color', 'red')
        })
    }
    // 设置logo(.tree)样式
    function setLogoColor() {
        if (gData >= 255) {
            return
        }
        gData += 2
        $('.tree').css('color', `rgb(80,${gData},0)`)
    }
    // 设置上传按钮样式
    function setBtnSubmit() {
        $('.btn_submit').on('mouseover', () => {
            $('.btn_submit').css('boxShadow', '0.15rem 0.15rem 0.5rem rgba(0,0,0,.5)')
        })
        $('.btn_submit').on('mouseleave', () => {
            $('.btn_submit').css('boxShadow', '0.1rem 0.1rem 0.2rem rgba(0,0,0,.5)')
        })
        $('.btn_submit').on('click', () => {
            $('.btn_submit').css('boxShadow', '0.05rem 0.05rem 0.2rem rgba(0,0,0,.5)')
        })
    }
    // 设置panel面板样式
    showHide()
    setSpeed()
    moniVal()
    showTime()
    setClickBtn()
    setLogoColor()
    setBtnSubmit()
    timer1 = setInterval(showTime, 1000)
    timer2 = setInterval(setLogoColor, 20)
})