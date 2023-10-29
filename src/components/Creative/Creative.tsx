import React, { useState } from "react";
import { Button, Input, Image } from "antd";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FabricJSEditor } from "@hooks/useFabricJSEditor";

type creativeProps = {
    editor: FabricJSEditor
}

type imageObj = {
    imageUrl: string,
    borderColor: string
}

export default function Creative({
    editor
}: creativeProps){

    // todo:初期表示にアップロードしてる画像を表示する

    const [imageObjs, setImageObjs] = useState<imageObj[]>([]);
    const [imageFile, setImageFile] = useState<File>();
    const onChangeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const fileObject = e.target.files[0];
        setImageFile(fileObject)
    }

    const handleImageClick = (inputIndex: number) => {
        setImageObjs(
        imageObjs.map((imageObj, index) => {
            if(index === inputIndex){
            imageObj.borderColor === 'black' ? imageObj.borderColor='blue' : imageObj.borderColor='black'
            }
            return imageObj
        })
        );
    };

    const onClickImageUpload = async () => {
        if(!imageFile){
        return;
        }
        const storageRef = ref(storage, `/creativeresources/${imageFile?.name}`);
        const res = await uploadBytes(storageRef, imageFile)
        .then((res) => {
            console.log("アップロード成功")
        })
        .catch((err) => {
            console.log("アップロード失敗")
            console.log(err)
            return
        });
        // todo:urlを直接叩いて取得
        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl)
        setImageObjs([...imageObjs, {imageUrl: downloadUrl, borderColor: "black"}])
    }

    const onClickImageAdd = () => {
        imageObjs.map((imageObj, index) => {
            if(imageObj.borderColor === "blue"){
                editor?.addImage(imageObj.imageUrl);
            }
        })
    }

    return (
        <div>
            <Input type="file" style={{ width: 300 }} onChange={onChangeImageUpload}></Input>
            <Button onClick={onClickImageUpload}>upload</Button>
            {imageObjs.map((imageObj, index) => {
                return (
                    <Image 
                    key={index}
                    src={imageObj.imageUrl} 
                    preview={false} 
                    style={{border: `2px solid ${imageObj.borderColor}`}}
                    onClick={() => handleImageClick(Number(index))}></Image>
                )
            })}
            <Button onClick={onClickImageAdd}>add image</Button>
            <Image src="https://firebasestorage.googleapis.com/v0/b/synapse-genius-dev-fbe11.appspot.com/o/creativeresources%2Fhagging_face.jpeg?alt=media"></Image>
        </div>
    )
}