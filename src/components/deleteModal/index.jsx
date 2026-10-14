import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React from 'react';


const DeleteModal = ({ modal, toggle, deleteCategory }) => {
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>
                Delete
            </ModalHeader>
            <ModalBody>
                Are you sure you want to delete this?
            </ModalBody>
            <ModalFooter>
                <button onClick={deleteCategory} className="btn btn-primary">Delete</button>
                <button onClick={toggle} className="btn btn-danger">Cancel</button>
            </ModalFooter>
        </Modal>
    )

}


export default DeleteModal;