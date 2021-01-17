
export function setting(token,field){
    try{
        const settings=null;
        fetch('http://localhost:8000/api/settings', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer '+token,
                'Content-Type' :'multipart/form-data',
            }
            }).then((response) => response.json())
            .then((json) => settings=json.data)
            .catch((error) => console.error(error));
        if(settings.field){
            return settings.field;
        }else{
            return false;
        }
    }catch(e){
        console.log(e);
    }
}

export function makeid(type=null,length=16){
    if(type=="numb"){
            var result = '';
            var characters ='0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
    }
    else{
        var result = '';
        var characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}