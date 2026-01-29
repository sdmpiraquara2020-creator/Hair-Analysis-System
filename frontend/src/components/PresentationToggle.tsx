export default function PresentationToggle() {
  function togglePresentation() {
    document.body.classList.toggle("presentation");
  }

  return (
    <button onClick={togglePresentation} className="presentation-btn">
      Modo Apresentação
    </button>
  );
}
