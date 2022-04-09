$(function () {
    var a = []
    const options = {
        clean: true,
        connectTimeout: 4000,
        clientId: 'fhq02_gxj',
        username: "admin",
        password: 'public'
    }
    const connectUrl = 'ws://114.55.237.151:8083/mqtt'
    // const connectUrl = 'ws://114.55.237.151:1883/mqtt'
    const client = mqtt.connect(connectUrl, options)
    //当重新连接启动触发回调
    client.on('reconnect', () => {
        console.log('正在重连.....')
    });
    //连接断开后触发的回调
    client.on("close", function () {
        $('.font_status').val('断开')
        console.log('连接断开')
    });
    //从broker接收到断开连接的数据包后发出。MQTT 5.0特性
    // client.on("disconnect",function (packet) {
    //     $("#div1").text("从broker接收到断开连接的数据包....."+packet);
    // });
    //客户端脱机下线触发回调
    client.on("offline", function () {
        $('.server_status').html('下线').css('color', '#555')
        console.log('客户端脱机下限')
    });
    //当客户端无法连接或出现错误时触发回调
    client.on("error", (error) => {
        $('.server_status').html('错误').css('color', '#555')
        console.log('客户端发生错误')
    });
    //成功连接后触发的回调
    client.on("connect", function (connack) {
        //订阅某主题
        /**
         * client.subscribe(topic/topic array/topic object, [options], [callback])
         * topic:一个string类型的topic或者一个topic数组,也可以是一个对象
         * options
         */
        client.subscribe(["Water", "DHT11", "DO"], {
            qos: 0
        }, (err, granted) => {
            console.log('订阅成功')
            console.log(granted)
            $('.topic_scribe').html(granted[0]['topic'] + '、' + granted[1]['topic'] + '、' + granted[2]['topic']).css('color', 'red')
        })
        $('.font_status').html('成功').css('color', 'red')
        $('.server_status').html('正常').css('color', 'red')
        //点击按钮发送数据
        $('.btn_submit').on('click', (e) => {
            e.preventDefault()
            publish()
        })
        $('.note_btn').on('click', () => {
            a[a.length] = {
                Water: w_d,
                Light: msg,
                Temperture: T,
                Humidity: H
            }
            let d = a[a.length - 1]
            for (let k in d) {
                if (d[k] === undefined) {
                    d[k] = '?'
                }
            }
            let n = a.length < 10 ? '0' + a.length : a.length
            let Uname = `data${n}.txt`
            let content = `Time:${a.length}\nWater=${d['Water']}ml、Light=${d['Light']}、Temperture=${d['Temperture']}°C、Humidity=${d['Humidity']}% 。`
            let blob = new Blob([content], {
                type: "text/plain;charset=utf-8"
            })
            saveAs(blob, Uname)
            $('.note_ani').css('backgroundColor', 'red').css('width', '50%')
        })
    })
    function publish() {
        //发布数据
        let w_d = $('.water').val()
        let d_d = $('.deg').val()

        if (isNaN(w_d) === true || isNaN(d_d) === true || d_d > 90 || d_d < -90 || w_d <= 0 || d_d === '' || w_d === '') {
            return alert('请输入有效数字')
        }
        client.publish("DJ", $('.water').val() + '#', {
            qos: 0
        }, () => {
            $('.post_data').html('已发送').css('color', 'red')
        });
        client.publish("GEN", $('.deg').val() + '#', {
            qos: 0
        }, () => {
            $('.post_data').html('已发送').css('color', 'red')
        });
    }
    let msg, T, H, w_d
    //接收到消息触发的回调函数
    client.on('message', (topic, message, packet) => {
        // var msg=JSON.parse(message.toString())
        if (topic === 'DO') {
            console.log('这是DO主题')
            msg = message.toString()
            console.log(msg);
            if (message.toString() === 'ON') {
                $('.light_ani').css('width', '50%').css('backgroundColor', 'yellow')
                $('.light_modle').css('color', 'yellow')
                $('.light_modle').html('&#xe6db;')
            } else {
                $('.light_ani').css('width', '10%').css('backgroundColor', '#333')
                $('.light_modle').css('color', '#000')
                $('.light_modle').html('&#xe6b8;')
            }
            $('.light_data').html(msg)
        }
        if (topic === 'DHT11') {
            T = message.toString().replace('#', '').replace(';', ':').split(':')[1]
            H = message.toString().replace('#', '').replace(';', ':').split(':')[3]
            while (T[0] === '0'&&T!=='0') {
                T = T.replace(T[0], '')
            }
            while (H[0] === '0'&&H!=='0') {
                H = H.replace(H[0], '')
            }
            console.log('这是DHT11主题')
            console.log(T, H)
            $('.tem_data').html(T + '°C')
            $('.hum_data').html(H + '%')
            $('.tem_ani').css('width', T / 5 + 20 + '%')
            $('.tem_ani').css('backgroundColor', 'rgb(' + (T * 5 + 50) + ',50,' + (200 - 5 * T))
            $('.tem_modle').css('color', 'rgb(' + (T * 5 + 50) + ',0,' + (200 - 5 * T))
            $('.hum_ani').css('width', H / 2 + 10 + '%')
            $('.hum_ani').css('backgroundColor', 'rgb(120,' + (210 - H * 2) + ',255)')
            $('.hum_modle').css('color', 'rgb(120,' + (210 - H * 2) + ',255)')
        }
        if (topic === 'Water') {
            w_d = message.toString().replace('#', '')
            while (w_d[0] === '0'&&w_d!=='0') {
                w_d = w_d.replace(w_d[0], '')
            }
            console.log('这是Water主题');
            console.log(w_d)
            $('.water_ani').css('width', w_d / 35 + 10 + '%').css('background', 'rgb(16,140,' + w_d / 10 + 100 + ')')
            $('.water_data').html(w_d + 'ml')
            $('.water_modle').css('color', 'rgb(10,10,' + w_d / 6.5 + ')')
        }
        // 文件上传效果
        $('.note_btn').css('color', 'rgb(51,51,51)')
        $('.note_ani').css('backgroundColor', 'rgb(53, 117, 105)').css('width', '15rem')
    });
})