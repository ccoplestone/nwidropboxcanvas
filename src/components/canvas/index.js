import 'babel-polyfill';
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import config from 'ch/config/index';

import { isIEOrEdge } from 'ch/services/browsercheck';
import Button from 'ch/components/button';

import styles from './styles.scss';

const Canvas = (props) => {
    const [imageURL, setImageURL] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [errorData, setErrorData] = useState('');
    const requestConfig = {
        headers: {
            Authorization: `Bearer ${props.dropboxAPIKey || ''}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': '{"path": "/signature.png","mode": "add","autorename": true,"mute": false}',
        },
    };

    window.addEventListener('load', () => {
        const canvas = document.querySelector('#canvas');
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clear = document.getElementById('clear');
        const upload = document.getElementById('upload');

        // Resizing
        canvas.height = 300;
        canvas.width = 600;

        // Vars
        let painting = false;

        function startPosition(e) {
            painting = true;
            draw(e);
        }

        function finishedPosition() {
            painting = false;
            ctx.beginPath();
            setImageURL(canvas.toDataURL());
        }

        function uploadToDropbox() {
            if (isIEOrEdge === 1) {
                const msBlob = canvas.msToBlob();
                axios.post(config.paths.api, msBlob, requestConfig);
            } else {
                canvas.toBlob(blobImageUpload, 'image/png');
            }
        }

        function draw(e) {
            if (!painting) return;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setImageURL('');
            setUploadSuccess(false);
        }

        // Listeners
        canvas.addEventListener('mousedown', startPosition);
        canvas.addEventListener('mouseup', finishedPosition);
        canvas.addEventListener('mousemove', draw);
        clear.addEventListener('click', clearCanvas);
        if (upload) {
            upload.addEventListener('click', uploadToDropbox);
        }
    });

    function blobImageUpload(data) {
        axios.post(config.paths.api, data, requestConfig)
            .then(() => {
                setUploadSuccess(true);
            })
            .catch(err => setErrorData(err.response.data.error_summary));
    }

    return (
        <Fragment>
            <div className={styles.wrapper}>
                <canvas id="canvas" className={styles.nwicanvas} />
                <Button buttonId="clear">Clear</Button>
                <h3 className={styles.title}>Signature preview</h3>
                {imageURL !== '' ? <img src={imageURL} alt="signature" /> : <p>No signature drawn.</p>}
                {imageURL !== '' ? <a download="signature.png" href={imageURL}>Download</a> : null}
                <Button buttonId="upload">Save {uploadSuccess !== false ?
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg>
                    </span> : null}
                </Button>
                {errorData !== '' ? <p>Invalid token son.</p> : null}
            </div>
        </Fragment>
    );
};

Canvas.propTypes = {
    dropboxAPIKey: PropTypes.string,
};

Canvas.defaultProps = {
    dropboxAPIKey: '',
};

export default Canvas;
