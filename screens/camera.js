import * as React from "react"
import {Button , View , Image , Platform} from "react-native"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"

export default class PickImage extends React.Component{
    state = {
        image: null
    }
    render(){
        let {image} = this.state()
        return(
            <View style ={{flex:1 , alignItems: "center" , justifyContent: "center"}}>
                <Button title = "Pick An Image from Your Gallery" onPress = {this._PickImage}>

                </Button>

            </View>
        )
    }
    componentDidMount(){
        this.getPermissionAsync()
    }

    getPermissionAsync = async() =>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status !== "granted"){
                alert("Permission Not Granted. Please provide one to open the folder.")
            }
        }
    }
    uploadImage = async(uri)=>{
        const data = new FormData()
        let fileName = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split('.')[uri.split('.').length-1]}`
        const fileToUpload = {
            uri:uri , 
            name:fileName ,
            type:type
        }
        data.append("Digit" , fileToUpload)
        fetch("" , {
            method: "POST" ,
            body: data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response) => response.json())
        .then((result) =>{
            console.log("Successfull" , result)
            
        })
        .catch((error) => {
            console.log("Error" , error)
        })
    }
    _PickImage = async ()=>{
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4 , 3],
                quality: 1
            })
           if(!result.cancelled){
            this.setState({image: result.data})
            console.log(result.uri)
            this.uploadImage(result.uri)
           } 
        }
        catch(E){
            console.log(E)
        }
    }
}
