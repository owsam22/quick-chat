import styled from 'styled-components';

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Behind everything */
  pointer-events: none;
  overflow: hidden;
  background-color: transparent;

  .container {
    width: 100%;
    height: 100%;
    
    /* Using solid blue for the pattern to guarantee visibility */
    background: linear-gradient(135deg, transparent 18.75%, #3b82f6 0 31.25%, transparent 0),
      linear-gradient(45deg, transparent 18.75%, #3b82f6 0 31.25%, transparent 0),
      linear-gradient(135deg, transparent 18.75%, #3b82f6 0 31.25%, transparent 0),
      linear-gradient(45deg, transparent 18.75%, #3b82f6 0 31.25%, transparent 0);
    background-size: 60px 60px;
    background-position:
      0 0,
      0 0,
      30px 30px,
      30px 30px;
    animation: slide 4s linear infinite;
    opacity: 0.8; /* Very high opacity for testing */
  }

  /* Force dark mode adjustment if needed */
  [data-theme="dark"] & .container {
    background: linear-gradient(135deg, transparent 18.75%, #6366f1 0 31.25%, transparent 0),
      linear-gradient(45deg, transparent 18.75%, #6366f1 0 31.25%, transparent 0),
      linear-gradient(135deg, transparent 18.75%, #6366f1 0 31.25%, transparent 0),
      linear-gradient(45deg, transparent 18.75%, #6366f1 0 31.25%, transparent 0);
    background-size: 60px 60px;
    opacity: 0.5;
  }

  @keyframes slide {
    from {
      background-position: 0 0, 0 0, 30px 30px, 30px 30px;
    }
    to {
      background-position:
        60px 0,
        60px 0,
        90px 30px,
        90px 30px;
    }
  }`;

export default Pattern;
