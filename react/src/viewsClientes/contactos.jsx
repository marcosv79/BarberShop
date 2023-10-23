export default function Contactos(){
    return (
        <div className='card animated fadeInDown' style={{ marginLeft: '100px' , marginRight: '100px'}}>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}/>
            <h2>Marcação por telefone:</h2>
            
            <div style={{ marginTop: '5px' }}>
            <h4>912 031 823</h4>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Para outros esclarecimentos:</h2>
                <h4>ipcabarbershop@gmail.com</h4>
            </div>


        <div>
          <iframe src="https://www.instagram.com/ipcabarbershop/embed/?cr=1&amp;v=13&amp;wp=1024&amp;rd=https%3A%2F%2Fwww.example.com&amp;rp=%2Fcontactos#%7B%22source%22%3A%22misc%22%2C%22medium%22%3A%22button%22%2C%22campaign%22%3A%22profile%22%7D" 
          allowtransparency="true" 
          frameborder="0" 
          scrolling="yes" 
 
         style={{border: 0, width: '50%', height: '300px', margin: 'auto'}}>
          </iframe>
        </div>
        <div id="map-container-google-3" class="z-depth-1-half map-container-3" style={{ marginTop: '50px' }}>
          <iframe src={`https://maps.google.com/maps?q=41.5369635,-8.6286349&t=k&z=13&ie=UTF8&iwloc=&output=embed`} 
          frameborder="0" 
          style={{border: 0, width: '100%', height: '300px', margin: 'auto'}} 
          allowFullScreen>
          </iframe>
        </div>
    </div>

    )
}


