import { Button, Modal } from "react-bootstrap";

function DeleteConfirmationModal(props) {
  const {
    title = "Confirm Delete",
    bodyText = "Are you sure ?",
    onClose,
    show,
    setShow,
  } = props;

  const handleClose = (success) => {
    setShow(false);
    onClose(success);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose(false)}>
          No
        </Button>
        <Button variant="danger" onClick={() => handleClose(true)}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DeleteConfirmationModal;
