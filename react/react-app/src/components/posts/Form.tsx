import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form'

import { AuthContext } from "../../App";

import { Post } from '../../interfaces/interface';
import { createPost } from '../../api/posts';

interface PostFormProps {
  form: boolean
  setForm: Function
  posts: Post[]
  setPosts: Function
}

  export const Form = ({ form, setForm, posts, setPosts }: PostFormProps) => {
    const { register, handleSubmit, formState: { errors },} = useForm<Post>();
    const { currentUser }= useContext(AuthContext);
    const user_id = currentUser?.id;

    const [isFileTypeError, setIsFileTypeError] = useState(false);
    const [photo, setPhoto] = useState<File>();
    const [preview, setPreview] = useState<string>("");

    const closeModal = () => {
      setForm(false);
    }

    const emptytarget = () => {
      (event!.target! as HTMLInputElement).value = '';
    }

    const handleFile = async() => {
      if ((event!.target! as HTMLInputElement).files === null || (event!.target! as HTMLInputElement).files!.length === 0) {
        return;
      }
      setIsFileTypeError(false);

      const file = (event!.target! as HTMLInputElement).files![0];

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/bmp",
          "image/svg+xml",
        ].includes(file.type)
      ) {
        setIsFileTypeError(true);
        return false;
      }

      setPhoto(file);
      setPreview(window.URL.createObjectURL(file));
      return true;
    }

    const onSubmit = async(data: Post) =>{

      const formData :any = new FormData();
      formData.append("post[user_id]", user_id);
      formData.append("post[title]", data.title);
      formData.append("post[contents]", data.contents);
      if (photo) formData.append("post[image]", photo);

      try {
        const res = await createPost(formData)
        if (res.status == 200) {
          setPosts([res.data, ...posts])
          setForm(false);
        } else {
          console.log(res.data.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const canselFile = () => {
      setIsFileTypeError(false);
      setPhoto(undefined);
      setPreview("");
    }

    return(
      <div>
        <h3 className="font-bold text-lg">NEW Posts!</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p className="py-4">title</p>
          <input type="text" placeholder="Type title here" className="input input-bordered w-full max-w-xs"
            {...register('title', {
              required: {
                value: true,
                message: 'タイトルを入力してください。',
              },
              maxLength: {
                value: 30,
                message: '30文字以内で入力してください。',
              },
            })}/>
            { errors.title?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.title.message}</span>
                </div>
              </div>
            }

          <p className="py-4">contents</p>
          <input type="text" placeholder="Type contents here" className="input input-bordered w-full max-w-xs"
            {...register('contents', {
              required: {
                value: true,
                message: '本文を入力してください。',
              },
              maxLength: {
                value: 3000,
                message: '3000文字以内で入力してください。',
              },
            })}/>
            { errors.contents?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.contents.message}</span>
                </div>
              </div>
            }

            <p>image uploade</p>
            <label className="btn">file uploade!!
              <input hidden type="file" id="photo" name="photo" accept="image/*,.png,.jpg,.jpeg,.gif" onChange={handleFile} onClick={emptytarget}/>
            </label>
            <br/>
            <button className="btn" type="submit">POST!</button>
          </form>
          <br/>
          {isFileTypeError && (
            <p>※jpeg, png, bmp, svg以外のファイル形式は表示されません</p>
          )}
          <button onClick={canselFile} className="btn">cancelFile</button>
          <button onClick={closeModal} className="btn">Close Modal</button>
          <br/>

          { preview ? (
            <div>
              <p>preview</p>
              <img src={preview} alt="preview img" />
            </div>
          ) : null
          }

      </div>
    )
  }

export default Form;
