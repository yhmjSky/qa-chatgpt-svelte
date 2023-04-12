<script lang="ts">
  export let value: any;
  export let placeholder = '';
  export let name = '';
  export let type = 'text';
  export let label = '';
  let classes = '';
  export { classes as class };

  const typeAction = (node: HTMLInputElement) => {
    node.type = type;
  };
</script>

<div class="flex flex-col min-w-xl {classes}">
  <label class="text-xs" for={name}>{label}</label>
  <input
    {name}
    {placeholder}
    use:typeAction
    bind:value
    class="input"
    {...$$restProps}
  />
</div>

<style>
  .input {
    box-shadow: 0 1px 2px 0 rgba(170, 165, 165, 0.856);
    background-color: rgba(113, 113, 146, 0.322);
    border-radius: 0.375rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    min-width: 40rem;
    color: #c6e7e5;
    border: 1px solid transparent;
    outline: none;
    transition: box-shadow 150ms ease-in-out;

}

.input:focus{
  box-shadow: 0 0 0 1px #4fd1c5;
      outline: none;
}

</style>