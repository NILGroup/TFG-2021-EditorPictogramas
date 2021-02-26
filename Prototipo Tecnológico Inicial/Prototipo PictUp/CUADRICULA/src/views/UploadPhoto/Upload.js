import React, { Component } from 'react';
import './Upload.css';
export class UploadPhoto extends Component {
  state={
    profileImg:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  }
  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () =>{
      if(reader.readyState === 2){
        this.setState({profileImg: reader.result})
      }
    }
    reader.readAsDataURL(e.target.files[0])
    console.log(e.target.files[0])

    localStorage.setItem("message", "saved in browser storage");
    // sets the value of "message" to be "saved in browser storage"
    console.log("HOLAAA!", localStorage.getItem("message"));
    
  };

  sendPhoto = (e) => {
    this.props.send(e);
  };

	render() {
    const { profileImg} = this.state
		return (
				<div className="container">
					<div className="img-holder">
						<img src={profileImg} alt="" id="img" className="img" />
					</div>
					<input type="file" accept="image/*" name="image-upload" id="input" onChange={this.imageHandler} />
					<div className="label">
                         <label className="image-upload" htmlFor="input">
						    +
					    </label>
                        <button className="image-upload" onClick={() => this.sendPhoto({profileImg})}>Canvas</button>
                    </div>
				</div>
		);
	}
}

export default UploadPhoto;