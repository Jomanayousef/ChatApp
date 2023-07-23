(function(){

    const app = document.querySelector(".chat");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0){
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-msg").addEventListener("click",function(){
        let message = app.querySelector(".chat-screen #input-msg").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my",{
            username:uname,
            text:message
        });
        socket.emit("chat",{
            username:uname,
            text:message
        });
        app.querySelector(".chat-screen #input-msg").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    }); 

    socket.on("update", function(update){
        renderMessage("update", update);
    });
    socket.on("chat", function(message){
        renderMessage("other", message);
    });


    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .msgs");
        if(type == "my"){
            let m = document.createElement("div");
            m.setAttribute("class","msg my-msg");
            m.innerHTML = `
            <div>
                <div class="name">YOU</div>
                <div class="text">${message.text}</div>
            </div>
            
            `;
            messageContainer.appendChild(m);
        }else if(type == "other"){
            let m = document.createElement("div");
            m.setAttribute("class","msg other-msg");
            m.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            
            `;
            messageContainer.appendChild(m);

        }else if(type == "update"){
            let m = document.createElement("div");
            m.setAttribute("class","update");
            m.innerText = message;
            messageContainer.appendChild(m);
        }
        //scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }



})();